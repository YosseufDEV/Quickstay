import drizzle from "@/db/drizzle";
import { hotels, hotelsBookings, hotelsCatalogs, rooms } from "@/db/schema";
import z from "zod";
import { BookingError } from "@/errors/bookingErrors";
import { HotelError } from "@/errors/hotelErrors";
import Hotel from "@/models/Hotel";
import { logger } from "@/utils/logger";
import dayjs from "dayjs";
import { and, eq, sql } from "drizzle-orm";
import { AppError } from "@/errors/errors";
import CachingService from "./CachingService";
import { parseRequest } from "@/helpers/parseRequest";
import { Optional } from "@/utils/optional";

type Query = {
    size?: string, 
    page?: string 
    sort?: string;
    order?: "asc" | "desc";
    city?: string;
    guests?: number;
    bookingDateRange?: { checkIn: Date, checkOut: Date };
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
};

class HotelService {
    static async getHotels(query: Query) {
        return CachingService.useCache(async () => {
            const MAXIMUM_PAGE_SIZE = 30;

            const schema = z.object({
                size: z.coerce.number().optional().default(10).superRefine((val, ctx) => {
                    if(val && val > MAXIMUM_PAGE_SIZE) {
                        ctx.addIssue({
                            code: "custom",
                            message: `Page size must not exceed ${MAXIMUM_PAGE_SIZE}`,
                        });
                    }
                }),
                page: z.coerce.number().optional().superRefine((val, ctx) => {
                    if(val && val < 1) {
                        ctx.addIssue({
                            code: "custom",
                            message: "Page number must be greater than 0",
                        });
                    }
                }).default(1),
                sort: z.enum(["price", "createdAt", "rating"]).optional(),
                order: z.enum(["asc", "desc"]).optional(),
                city: z.string().optional(),
                guests: z.coerce.number().optional(),
                minPrice: z.coerce.number().optional(),
                maxPrice: z.coerce.number().optional(),
                checkIn: z.coerce.date().optional(),
                checkOut: z.coerce.date().optional(),
            })
                .superRefine((data, ctx) => {
                    if(data.checkIn && data.checkOut && dayjs(data.checkIn).isAfter(dayjs(data.checkOut))) {
                        ctx.addIssue({
                            code: "custom",
                            message: "Check-in date must be before check-out date",
                        });
                    }

                    if(data.checkIn && !data.checkOut || !data.checkIn && data.checkOut) {
                        ctx.addIssue({
                            code: "custom",
                            message: "Both check-in and check-out dates must be provided",
                        });
                    }
                })

            const { size, page, sort, order, city, guests, checkIn, checkOut, minPrice, maxPrice } = parseRequest(schema, query, "query");

            const hotels = await Hotel.getHotels(size, page, 
                { sort, order, city, minPrice, maxPrice, guests, 
                    ...Optional("bookingDateRange", checkIn && checkOut, { checkIn, checkOut }) 
                });

            return hotels;

        }, `hotels:${JSON.stringify(query)}`, 60 * 5);
        
    }

    static async getHotelById(params: { hotelId: string }) {
        return CachingService.useCache(async () => {
            const schema = z.object({
                hotelId: z.uuid()
            });

            const { hotelId } = parseRequest(schema, params);

            const hotel = await Hotel.getHotelById(hotelId as string);

            if(!hotel) {
                throw new HotelError("hotel_not_found", 404);
            }

            return hotel;

        }, `hotel:${params.hotelId}`, 60 * 5);
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
                                    .where(sql`${hotelsBookings.timeRange} && tstzrange(${checkIn}, ${checkOut}, '[)')`)
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
                                availability: sql`
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

        if(!result) {
            throw new AppError({ message: "availability_not_found", statusCode: 404 });
        }

        return result;
    }

    static async checkAvailabilityByTypeId(params: Record<any, any>, { checkIn, checkOut }: { checkIn: Date, checkOut: Date }) {
        const { typeId, hotelId } = parseRequest(z.object({ typeId: z.uuid(), hotelId: z.uuid() }), params) as { typeId: string, hotelId: string };

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
                                .where(and(eq(rooms.typeId, typeId), eq(rooms.hotelId, hotelId)))
                                .groupBy(rooms.typeId, rooms.hotelId)

        if(!result.length) {
            throw new AppError({ message: "availability_not_found", statusCode: 404 });
        }

        return result;
    }

    static async getHotelsCities() {
        return CachingService.useCache(async () => {
            const cities = await drizzle.selectDistinct({
                                        city: hotels.city
                                    })
                                    .from(hotels)
                                    .then((cities) => cities.map(c => c.city))

            return cities;
        }, `hotels:cities`, 60 * 60 * 24);
    }

}

export default HotelService;
