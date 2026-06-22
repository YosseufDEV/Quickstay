import { type IHotel } from "@quickstay/types/Hotel"
import drizzle from "../db/drizzle";
import { hotels, hotelsTags } from "../db/schema";

const AllowedFields = new Set(["price", "createdAt", "rating"]);

const getSortingOptions = (sortBy: string | undefined, order: "asc" | "desc"="desc") => {
    if(!sortBy || !AllowedFields.has(sortBy)) return { createdAt: "desc" };

    switch (sortBy) {
        case "price":
            return { pricePerNight: order };
        case "rating":
            return { rating: order };
        case "createdAt":
            return { createdAt: order };
    }
}

class Hotel {
    static async createHotel({ tags, ...hotelData }: Omit<IHotel, 'id'>) {
        const [hotel] =  await drizzle.insert(hotels).values({
            ...hotelData,
        }).returning();

        if(!hotel) {
            throw new Error("Failed to create hotel");
        }

        await drizzle.insert(hotelsTags).values(
            tags.map(tag => ({
                hotelId: hotel.id,
                tagId: tag.id
            }))
        ).returning();

        return { ...hotel, tags };
    }

    static async getHotels(limit?: number, sortBy?: string, order?: "asc" | "desc", offset?: number) {
        const hotels = await drizzle.query.hotels.findMany({
            with: {
                tags: true,
                booking: true
            },
            ...(limit ? { limit } : {}),
            ...(offset ? { 
                offset
            } : {}),
            orderBy: {
                ...getSortingOptions(sortBy, order)
            },
        })

        return hotels;
    }

    static async getHotelById(hotelId: string) {
        const hotel = await drizzle.query.hotels.findFirst({
            where: {
                id: hotelId 
            },
            with: {
                tags: true, 
            }
        });

        return hotel;
    }
    
}

export default Hotel;
