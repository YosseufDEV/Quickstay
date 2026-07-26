import drizzle from "@/db/drizzle";
import { hotelsBookings, hotelsCatalogs, hotelsFees, payments, rooms } from "@/db/schema";
import z from "zod";
import { BookingError } from "@/errors/bookingErrors";
import { HotelError } from "@/errors/hotelErrors";
import Hotel from "@/models/Hotel";
import { logger } from "@/utils/logger";
import dayjs from "dayjs";
import { and, eq, sql } from "drizzle-orm";
import { parseRequest } from "@/helpers/parseRequest";
import type { RequestParamHandler } from "express";

class HotelService {
    static async getHotels(query: { limit?: string, offset?: string, sort?: string, order?: "asc" | "desc" }) {
        let limit = Math.min(Math.abs(Number(query.limit)), 30) || 30;
        let offset = Number(query.offset) || 0;

        const sort = query.sort as string | undefined;
        const order = (query.order as "asc" | "desc") || "asc";

        if(limit <= 0 || isNaN(limit) || isNaN(offset)) {
            throw new HotelError("invalid_pagination_parameters", 400);
        }

        if(sort && !["price", "createdAt", "rating"].includes(sort)) {
            throw new HotelError("invalid_sort_parameter", 400);
        }

        if(order && !["asc", "desc"].includes(order)) {
            throw new HotelError("invalid_order_parameter", 400);
        }

        const hotels = await Hotel.getHotels(limit, offset > 0 ? offset : 0, sort, order);
        
        return hotels;
    }

    static async getHotelById(params: { hotelId: string }) {
        const schema = z.object({
            hotelId: z.uuid()
        });

        const { hotelId } = parseRequest(schema, params);

        const hotel = await Hotel.getHotelById(hotelId as string);

        if(!hotel) {
            throw new HotelError("hotel_not_found", 404);
        }

        return hotel;
    }

    static async checkAvailability(params: Record<any, any>, { checkIn, checkOut }: { checkIn: Date, checkOut: Date }) {
        const { hotelId } = parseRequest(z.object({ hotelId: z.uuid() }), params) as { hotelId: string };

        checkIn = dayjs(checkIn).startOf("day").utc().toDate();
        checkOut = dayjs(checkOut).startOf("day").utc().toDate();

        const bookingSubQuery = drizzle
                                    .select({
                                        roomTypeId: hotelsBookings.roomTypeId,                                  
                                        overlappingBookingsCount: sql<number>`COUNT(DISTINCT ${hotelsBookings.roomId})`.as("overlappingBookingsCount")
                                    })
                                    .from(hotelsBookings)
                                    .where(sql`${hotelsBookings.timeRange} && tstzrange(${checkIn}, ${checkOut}, '[]')`)
                                    .groupBy(hotelsBookings.roomTypeId)
                                    .as("booking");

        const roomsSubQuery = drizzle
                                .select({           
                                    typeId: rooms.typeId,
                                    hotelId: rooms.hotelId,
                                    roomsCounts: sql<number>`COUNT(${rooms.id})`.as("roomsCounts")
                                })
                                .from(rooms)
                                .groupBy(rooms.typeId, rooms.hotelId)
                                .as("rooms");


        const result = await drizzle
                            .select({
                                hotelId: hotelsCatalogs.hotelId,
                                catalogAvailability: sql`
                                    json_agg(
                                        json_build_object(
                                            'typeId', ${hotelsCatalogs.id},
                                            'isAvailable', COALESCE(${bookingSubQuery.overlappingBookingsCount}, 0) < COALESCE(${roomsSubQuery.roomsCounts}, 0)
                                        )
                                    )
                                `
                            })
                            .from(hotelsCatalogs)
                            .leftJoin(bookingSubQuery, eq(bookingSubQuery.roomTypeId, hotelsCatalogs.id))
                            .leftJoin(roomsSubQuery, and(eq(roomsSubQuery.typeId, hotelsCatalogs.id), eq(roomsSubQuery.hotelId, hotelsCatalogs.hotelId)))
                            .groupBy(hotelsCatalogs.hotelId)
                            .where(eq(hotelsCatalogs.hotelId, hotelId))
                            .then(([availability]) => availability!)
                            .catch((err) => {
                                logger.error(`Failed to check availability for hotel ${hotelId} from ${checkIn} to ${checkOut}`);
                                throw new BookingError('Failed to check availability', 400, err);
                            });
        return result;
    }

    static async checkAvailabilityByTypeId({ roomTypeId, checkIn, checkOut }: { roomTypeId: string, checkIn: Date, checkOut: Date }) {
        checkIn = dayjs(checkIn).startOf("day").utc().toDate();
        checkOut = dayjs(checkOut).startOf("day").utc().toDate();

        const result = await drizzle
                                .select({           
                                    typeId: rooms.typeId,
                                    isAvailable: sql<boolean>`
                                        COUNT(${rooms.id}) > COALESCE(COUNT(DISTINCT ${hotelsBookings.roomId}), 0)           
                                    `
                                })
                                .from(rooms)
                                .leftJoin(hotelsBookings, and(eq(hotelsBookings.roomId, rooms.id), sql`${hotelsBookings.timeRange} && tstzrange(${checkIn}, ${checkOut}, '[]')`))
                                .where(eq(rooms.typeId, roomTypeId))
                                .groupBy(rooms.typeId, rooms.hotelId)

        return result;
    }

}

export default HotelService;
