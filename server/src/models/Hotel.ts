import drizzle from "../db/drizzle";
import { hotels, rooms, hotelsTags, amenities as s_amenities, type RoomType } from "../db/schema";
import Room from "./Room";
import { eq } from "drizzle-orm";

const AllowedFields = new Set(["price", "createdAt", "rating"]);

const getSortingOptions = (sortBy: string | undefined, order: "asc" | "desc" = "desc") => {
    if (!sortBy || !AllowedFields.has(sortBy)) return { createdAt: "desc" };

    switch (sortBy) {
        case "price":
            return { pricePerNight: order };
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
    hotel: Omit<HotelData, "amenities" | "rooms"> & { id: string };
    rooms: {
        pricePerNight: number;
        roomType: RoomType;
        status: string;
        imageUrl: string;
    },
    // amenities: { id: number, slag: string }[]
}

class Hotel {
    static processRawHotelData(rawData: RowHotelData[]) {
        const hotelMap = new Map<string, HotelData & { id: string }>();

        for (const row of rawData) {
            const hotelId = row.hotel.id;

            if(!hotelMap.has(hotelId)) {
                hotelMap.set(hotelId, {
                    id: hotelId,
                    name: row.hotel.name,
                    address: row.hotel.address,
                    exactAddress: row.hotel.exactAddress,
                    rating: row.hotel.rating,
                    imageUrl: row.hotel.imageUrl,
                    amenities: [],
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
            await drizzle.insert(hotelsTags).values(
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
        const paginatedHotels = drizzle.select().from(hotels).offset(offset || 0).limit(limit || 20).as("hotel")

        const dbHotels = await drizzle.select()
                                    .from(paginatedHotels)
                                    .leftJoin(rooms, eq(paginatedHotels.id, rooms.hotelId)) as RowHotelData[];

        return this.processRawHotelData(dbHotels);

    }

    static async getHotelById(hotelId: string) {
        const hotel = await drizzle.query.hotels.findFirst({
            where: {
                id: hotelId
            },
            with: {
                amenities: true,
            }
        });

        return hotel;
    }

}

export default Hotel;
