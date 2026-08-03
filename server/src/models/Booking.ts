import drizzle, { type Transaction } from "@/db/drizzle";
import { eq, sql, and, not, exists } from "drizzle-orm";
import { hotelsBookings, rooms, roomsTimeRangesLocks } from "@/db/schema";
import { logger } from "@/utils/logger";
import { isOverlappingDatesError, BookingError } from "@/errors/bookingErrors";
import Hotel from "./Hotel";
import { StatusCode } from "@/helpers/response";
import dayjs from "dayjs";

interface BookingData {
    userId: string
    hotelId: string
    roomTypeId: string
    from: Date
    to: Date
}

export interface BookingResponse {
    details: {
        id: string
        roomId: string
        userId: string
        timeRange: {
            from: Date  
            to: Date
        }
        bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED"
        checkInStatus: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT"
        hotel: {
            id: string
            name: string
            address: string
            rating: number
            checkInTime: string
            checkOutTime: string
        }
    }
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

        const roomLockExists = (tx ?? drizzle)
            .select()
            .from(roomsTimeRangesLocks)
            .where(
                and(
                    eq(roomsTimeRangesLocks.roomId, rooms.id),
                    sql`${roomsTimeRangesLocks.timeRange} = tstzrange(${from}, ${to}, '[)')`
                ))

        const [room] = await (tx ?? drizzle)
            .select({ id: rooms.id })
            .from(rooms)
            .leftJoin(hotelsBookings, eq(rooms.id, hotelsBookings.roomId))
            .where(
                and(
                    eq(rooms.typeId, roomTypeId), 
                    eq(rooms.hotelId, hotelId), 
                    not(exists(overlappingBookings)),
                    not(exists(roomLockExists))
                )
            )
            // Round-robin selection of the least booked room for the same room type
            .orderBy(sql`COUNT(${hotelsBookings.id}), ${rooms.id} ASC`)
            .groupBy(rooms.id, hotelsBookings.roomId)
            .limit(1)
            .execute()
            .catch((err) => {
                console.log(err);
                throw new BookingError('Failed to select room for booking', 400, err);
            });

        if (!room) {
            logger.error(`No available room truefound for type-id: ${roomTypeId} and time range: ${from} - ${to}`);
            throw new BookingError('no_available_room');
        }

        const details = await (tx ?? drizzle)
            .insert(hotelsBookings)
            .values({
                hotelId,
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

        await Booking.createRoomLock({ roomId: room.id, timeRange: { from, to }, bookingId: details.id, userId }, tx);
        const hotel = await Hotel.getHotelById(hotelId, tx)!;

        if(!hotel) {
            logger.error(`Hotel with id: ${hotelId} not found`);
            throw new BookingError('Hotel not found', 404);
        }

        logger.info(`Booking created successfully for 
                    userId: ${userId}, 
                roomId: ${room.id}, 
                from: ${from}, 
                to: ${to}
                `);

    return { 
        details: {
            ...details,
            hotel: {
                id: hotel.id,
                name: hotel.name,
                address: hotel.address,
                rating: hotel.rating,
                checkInTime: hotel.checkInTime,
                checkOutTime: hotel.checkOutTime,
            }
        }
    }
    }

    static async  getBookingById(id: string) {
        return await drizzle.query.hotelsBookings.findFirst({
            where: {
                id: id,
            },
            with: {
                user: {
                    columns: {
                        password: false
                    }
                }
            }
        });
    }

    // TODO: add pagination and filtering
    static async  getAllBookings() {
        const bookings =  await drizzle.query.hotelsBookings.findMany({
            with: {
                room: true,
                user: {
                    columns: {
                        password: false,
                        role: false
                    }
                },
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

    static async createRoomLock({ roomId, timeRange, bookingId, userId }: { roomId: string, timeRange: { from: Date, to: Date }, bookingId: string, userId: string }, tx?: Transaction) {
        return await (tx ?? drizzle).insert(roomsTimeRangesLocks).values({
            roomId,
            bookingId,
            timeRange: {
                from: timeRange.from,
                to: timeRange.to
            },
            lockedUntil: dayjs().add(1, "day").toDate(),
            lockedFor: userId
        })
        .returning()
        .then( ([lock]) => {
            logger.info(`Room lock created successfully for room with id: ${roomId} and booking id: ${bookingId}`);
            return lock;
        })
        .catch((err) => {
            logger.error(`Failed to create room lock for room with id: ${roomId}`);
            throw new BookingError('Failed to create room lock', 400, err);
        });
    }
}

export default Booking;
