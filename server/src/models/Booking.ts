import drizzle, { type Transaction } from "@/db/drizzle";
import { eq, sql, and, not, exists } from "drizzle-orm";
import { hotelsBookings, rooms } from "@/db/schema";
import { logger } from "@/utils/logger";
import { isOverlappingDatesError, BookingError } from "@/errors/bookingErrors";
import Hotel from "./Hotel";
import { StatusCode } from "@/helpers/response";

interface BookingData {
    userId: string
    hotelId: string
    roomTypeId: string
    from: Date
    to: Date
}

class Booking {
    static async createBooking({ roomTypeId, hotelId, userId, from, to }: BookingData, tx?: Transaction) {
        if(!await Hotel.hasRoomType(hotelId, roomTypeId)) {
            throw new BookingError('invalid_room_type');
        }

        const overlappingBookings = (tx ?? drizzle)
            .select()
            .from(hotelsBookings)
            .where(
                and(
                    eq(hotelsBookings.roomId, rooms.id),
                    sql`${hotelsBookings.timeRange} && tstzrange(${from}, ${to})`
                ))

                const [room] = await (tx??drizzle)
                    .select({ id: rooms.id })
                    .from(rooms)
                    .where(and(eq(rooms.typeId, roomTypeId), eq(rooms.hotelId, hotelId), not(exists(overlappingBookings))))
                    .orderBy(sql`RANDOM()`)
                    .limit(1)
                    .execute()
                    .catch((err) => {
                        console.log(err);
                        throw new BookingError('Failed to select room for booking', 400, err);
                    });

                if (!room) {
                    logger.error(`No available room found for type-id: ${roomTypeId} and time range: ${from} - ${to}`);
                    throw new BookingError('no_available_room');
                }

                const details = await (tx??drizzle)
                    .insert(hotelsBookings)
                    .values({
                        roomId: room.id,
                        roomTypeId,
                        userId: userId,
                        timeRange: {
                            from: from,
                            to: to
                        }
                    })
                    .returning({
                            id: hotelsBookings.id,                  
                            roomId: hotelsBookings.roomId,
                            userId: hotelsBookings.userId,
                            timeRange: hotelsBookings.timeRange,
                            bookingStatus: hotelsBookings.bookingStatus,
                            checkInStatus: hotelsBookings.checkInStatus
                    })
                    .then(([booking]) => booking!)
                    .catch(async (err) => {
                        if(isOverlappingDatesError(err)) {
                            throw new BookingError('overlapping_booking', StatusCode.UNPROCESSABLE_ENTITY);
                        }

                        console.log(err);
                        logger.error(`Failed to create booking`);
                        logger.debug(`BookingError: ${err}`);

                        throw new BookingError('Failed to create booking', 400, err);
                    });

                logger.info(`Booking created successfully for 
                            userId: ${userId}, 
                        roomId: ${room.id}, 
                        from: ${from}, 
                        to: ${to}
                        `);

            return { details };
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

    static async confirmBooking(bookingId: string, tx?: Transaction) {
        const updatedBooking = await (tx ?? drizzle).update(hotelsBookings).set({
                bookingStatus: "CONFIRMED",
            })
                .where(eq(hotelsBookings.id, bookingId))
                .returning()
                .then(([updatedBooking]) => updatedBooking)
                .catch((err) => {
                    logger.error(`Failed to confirm booking with id: ${bookingId}`);
                    throw new BookingError('Failed to confirm booking', 400, err);
                });

        if(updatedBooking?.bookingStatus !== "CONFIRMED") {
            logger.error(`Booking with id: ${bookingId} was not confirmed`);
            throw new BookingError('Booking was not confirmed', 400);
        }

        logger.info(`Booking with id: ${bookingId} confirmed successfully`);

        return updatedBooking;
    }
}

export default Booking;
