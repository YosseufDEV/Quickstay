import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import drizzle from "../db/drizzle";
import { eq, sql, and, not, exists } from "drizzle-orm";
import { hotelsBookings, hotelsCatalogs, hotelsFees, rooms } from "../db/schema";
import { logger } from "../utils/logger";
import { isOverlappingDatesError, BookingError } from "@/errors/bookingErrors";
import Hotel from "./Hotel";

interface BookingData {
    userId: string;
    roomId: string;
    from: Date;
    to: Date;
}

class Booking {
    static async book({ roomType, hotelId, userId, from, to }: { roomType: string, hotelId: string, userId: string, from: Date, to: Date }) {
        return await drizzle.transaction(async (tx) => {

            if(!await Hotel.hasRoomType(hotelId, roomType)) {
                throw new BookingError('invalid_room_type');
            }

            const overlappingBookings = tx
                .select()
                .from(hotelsBookings)
                .where(
                    and(
                        eq(hotelsBookings.roomId, rooms.id),
                        sql`${hotelsBookings.timeRange} && tstzrange(${from}, ${to})`
                ))

            const [room] = await tx
                                .select({ id: rooms.id })
                                .from(rooms)
                                .where(and(eq(rooms.type, roomType), eq(rooms.hotelId, hotelId), not(exists(overlappingBookings))))
                                .orderBy(sql`RANDOM()`)
                                .limit(1)
                                .execute()
                                .catch((err) => {
                                    console.log(err);
                                    throw new BookingError('Failed to select room for booking', 400, err);
                                });

            if (!room) {
                logger.error(`No available room found for roomType: ${roomType} and time range: ${from} - ${to}`);
                throw new BookingError('no_available_room');
            }

            const booking = await tx.insert(hotelsBookings).values({
                roomId: room.id,
                userId: userId,
                timeRange: {
                    from: from,
                    to: to
                }
            })
                .returning()
                .then(([booking]) => booking)
                .catch((err) => {
                    if(isOverlappingDatesError(err)) {
                        throw new BookingError('overlapping_booking');
                    }

                    logger.error(`Failed to create booking`);
                    logger.debug(`BookingError: ${err}`);

                    throw new BookingError('Failed to create booking', 400, err);
                });

            const numberOfNights = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

            // TODO: This feels out of place here, maybe move it to a separate function or service
            const [receipt] = await tx.
                                select({
                                    hotelId: hotelsCatalogs.hotelId,
                                    roomType: hotelsCatalogs.roomType,
                                    pricePerNight: hotelsCatalogs.pricePerNight,
                                    numberOfNights: sql<number>`${numberOfNights}`,
                                    basePrice: sql<number>`${hotelsCatalogs.pricePerNight} * ${numberOfNights}`,
                                    fees: sql<{ type: string, percentage: number }>`json_agg(json_build_object('type', ${hotelsFees.feeType}, 'amount', ${hotelsFees.percentage}))`,
                                    totalPrice: sql<number>`CEIL( ${hotelsCatalogs.pricePerNight}*${numberOfNights} * EXP(SUM(LN(1+ ${hotelsFees.percentage}::FLOAT /100 ))) )`,
                                })                
                                .from(hotelsCatalogs)
                                .where(and(eq(hotelsCatalogs.hotelId, hotelId), eq(hotelsCatalogs.roomType, roomType)))
                                .leftJoin(hotelsFees, eq(hotelsCatalogs.hotelId, hotelsFees.hotelId))
                                .groupBy(hotelsCatalogs.id, hotelsFees.id)

            logger.info(`Booking created successfully for userId: ${userId}, roomId: ${room.id}, from: ${from}, to: ${to}`);

            return { booking, receipt };
        })
    }

    static async  getBookingById(id: string) {
        return await drizzle.query.hotelsBookings.findFirst({
            where: {
                id: id,
            },
            with: {
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
