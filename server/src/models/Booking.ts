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

    // static async book({ roomType, userId, from, to }: { roomType: string, userId: string, from: Date, to: Date }) {
    //     return await drizzle.transaction(async (tx) => {
    //             const [room] = await tx.select().from(rooms).where(eq(rooms.roomType, roomType)).for('update', { noWait: true }).execute().catch((err) => {
    //                 if(err.code === '55P03') {
    //                     logger.error(`Room is locked by another transaction`);
    //                     throw new Error('Room is currently locked under another transaction.');
    //                 }
    //                 throw new Error('Failed to select row for update');
    //             });
    //
    //             if(room!.status === 'BOOKED') {
    //                 throw new Error('Room is already booked');
    //             }
    //
    //             if(room!.status === 'MAINTENANCE') {
    //                 throw new Error('Room is under maintenance');
    //             }
    //
    //             const booking = await Booking.createBooking({
    //                 roomId: room!.id,
    //                 userId,
    //                 from,
    //                 to
    //             }, tx).catch((err) => {
    //                 logger.error(`Failed to create booking: ${err.message}`);
    //                 throw new Error('Failed to create booking');
    //             });
    //
    //             return booking;
    //     })
    // }

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
                room: true,
                user: true,
            },
            limit: 10,
        });

        return bookings;
    }
}

export default Booking;
