import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import drizzle from "../db/drizzle";
import { eq } from "drizzle-orm";
import { hotelsBookings, hotels, rooms } from "../db/schema";
import { logger } from "../utils/logger";

interface BookingData {
    userId: string;
    roomId: string;
    from: Date;
    to: Date;
}

class Booking {
    static async createBooking(data: BookingData, tx?: PgAsyncTransaction<any, any, any, any>): Promise<any> {
        return await (tx ? tx : drizzle).insert(hotelsBookings).values({
            roomId: data.roomId,
            userId: data.userId,
            timeRange: {
                from: data.from,
                to: data.to
            }
        }).returning().then(([booking]) => booking)!;
    }

    static async book({ roomId, userId, from, to }: { roomId: string, userId: string, from: Date, to: Date }) {
        return await drizzle.transaction(async (tx) => {
                await tx.select().from(rooms).where(eq(rooms.id, roomId)).for('update', { noWait: true }).execute().catch((err) => {
                    if(err.code === '55P03') {
                        logger.error(`Room ${roomId} is locked by another transaction`);
                        throw new Error('Room is currently locked under another transaction.');
                    }
                    throw new Error('Failed to select row for update');
                });

                const booking = await Booking.createBooking({
                    roomId,
                    userId,
                    from,
                    to
                }, tx);

                await tx
                        .update(rooms)
                        .set({ bookedBy: userId, status: 'BOOKED' })
                        .where(eq(rooms.id, roomId))
                        .returning();

                return booking;
        })
    }


    static async  getBookingById(id: string) {
        return await drizzle.query.hotelsBookings.findFirst({
            where: {
                id
            },
            with: {
                hotel: true,
                user: true
            }
        });
    }

    // TODO: add pagination and filtering
    static async  getAllBookings() {
        const bookings =  await drizzle.query.hotelsBookings.findMany({
            with: {
                hotel: true,
                user: true
            }
        });

        return bookings;
    }
}

export default Booking;
