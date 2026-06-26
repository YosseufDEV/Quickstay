import drizzle from "../db/drizzle";
import { hotels, rooms, amenities as s_amenities, hotelsAmenities, type RoomType } from "../db/schema";
import Room from "./Room";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

const AllowedFields = new Set(["price", "createdAt", "rating"]);

const getSortingOptions = (sortBy: string | undefined, order: "asc" | "desc" = "desc") => {
    if (!sortBy || !AllowedFields.has(sortBy)) return { createdAt: "desc" };

    switch (sortBy) {
        case "price":
            return (order=="desc" ? desc(rooms.pricePerNight) : rooms.pricePerNight);
        case "rating":
            return { rating: order };
        case "createdAt":
            return { createdAt: order };
    }
}

interface HotelData {
    name: string;
    address: string;
    exactAddress: string;
    rating: number;
    imageUrl: string;
    amenities: { id: number }[];
    rooms: {
        pricePerNight: number;
        roomType: RoomType;
        status: string;
        imageUrl: string;
    }[];
}

interface RowHotelData {
    hotel: Omit<HotelData, "amenities" | "rooms"> & { id: string, amenities: any[] };
    rooms: {
        pricePerNight: number;
        roomType: RoomType;
        status: string;
        imageUrl: string;
    },
    counts: { room_type: RoomType, count: number }[],
    amenities: {
        hotelId: string,
        amenities: { id: number, slag: string }[]
    }
    // amenities: { id: number, slag: string }[]
}

class Hotel {
    static processRawHotelData(rawData: RowHotelData[]) {
        const hotelMap = new Map<string, HotelData & { id: string }>();

        for (const row of rawData) {
            const hotelId = row.hotel.id;

            if(!hotelMap.has(hotelId)) {
                hotelMap.set(hotelId, {
                    ...row.hotel,
                    amenities: row.amenities.amenities,
                    counts: row.roomsCounts.counts,
                    rooms: []
                })
            }

            hotelMap.get(hotelId)!.rooms.push(row.rooms);
        }
   
        return Array.from(hotelMap.values());
    }

    static async createHotel({ rooms, amenities, ...hotelData }: HotelData) {
        const [hotel] = await drizzle.insert(hotels).values({
            ...hotelData,
        }).returning();

        if (!hotel) {
            throw new Error("Failed to create hotel");
        }

        if (amenities.length !== 0) {
            await drizzle.insert(hotelsAmenities).values(
                amenities.map(amentiy => ({
                    hotelId: hotel.id,
                    amenityId: amentiy.id
                }))
            )
        }

        if(rooms.length !== 0) {
            await Room.createRoom(rooms.map(room => ({...room, hotelId: hotel.id })));
        }

        const createdTags = await drizzle.select({ id: s_amenities.id, slag: s_amenities.slag }).from(hotelsTags).innerJoin(s_amenities, eq(hotelsTags.amenityId, s_amenities.id)).where(eq(hotelsTags.hotelId, hotel.id));

        return { ...hotel, amenities: createdTags };
    }

    static async getHotelsSlow(limit?: number, offset?: number, sortBy?: string, order?: "asc" | "desc") {
        const h = await drizzle.query.hotels.findMany({
            with: {
                amenities: true,
                rooms: true,
            },
            ...(limit ? { limit } : { limit: 20 }),
            ...(offset ? {
                offset
            } : {}),
        });
        return h;
    }

    static async getHotels(limit?: number, offset?: number, sortBy?: string, order?: "asc" | "desc") {
        const paginatedHotels = drizzle.select()
                                .from(hotels)
                                .offset(offset || 0)
                                .limit(limit || 20)
                                .as("hotel")

        const hotelIdsSq = drizzle.select({ id: paginatedHotels.id }).from(paginatedHotels);


        const amenitiesQuery = drizzle.select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql`json_agg(json_build_object('id', ${s_amenities.id}, 'slag', ${s_amenities.slag}))`.as("amenities"),
        }).from(hotelsAmenities).where(inArray(hotelsAmenities.hotelId, hotelIdsSq)).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).groupBy(hotelsAmenities.hotelId).as("amenities");


        const roomCountSubQuery = drizzle.select({ 
            hotelId: rooms.hotelId,
            roomType: rooms.roomType,
            count: sql`COUNT(${rooms.id})`.as("cnt")
        }).from(rooms).where(and(eq(rooms.status, "AVAILABLE"), inArray(rooms.hotelId, hotelIdsSq))).groupBy(rooms.hotelId, rooms.roomType).as("roomsCounts");

        const roomsCountQuery = drizzle.select({
            hotelId: roomCountSubQuery.hotelId,
            counts: sql`json_agg(json_build_object('room_type', ${roomCountSubQuery.roomType}, 'count', ${roomCountSubQuery.count}))`.as('counts') 
        }).from(roomCountSubQuery).groupBy(roomCountSubQuery.hotelId).as("roomsCounts");

        const dbHotels = drizzle.select()
                                    .from(paginatedHotels)
                                    .leftJoin(amenitiesQuery, eq(paginatedHotels.id, amenitiesQuery.hotelId))
                                    .leftJoin(rooms, eq(paginatedHotels.id, rooms.hotelId))
                                    .leftJoin(roomsCountQuery, eq(paginatedHotels.id, roomsCountQuery.hotelId));
        console.log(dbHotels.toSQL().sql);
        return this.processRawHotelData(await dbHotels as unknown as RowHotelData[]);

    }

    static async getHotelById(hotelId: string) {
        const hotel = await drizzle.query.hotels.findFirst({
            where: {
                id: hotelId
            },
            with: {
                amenities: true,
                rooms: true,
            }
        });

        return hotel;
    }

    static async getHotelRooms(hotelId: string) {
        return await Room.getRoomsByHotelId(hotelId);
    }

}

export default Hotel;
