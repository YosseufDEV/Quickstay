import { type IHotel } from "@quickstay/types/Hotel"
import drizzle from "../db/drizzle";
import { hotels, hotelsTags, tags as stags } from "../db/schema";
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

class Hotel {
    static async createHotel({ tags, ...hotelData }: Omit<IHotel, 'id'>) {
        const [hotel] = await drizzle.insert(hotels).values({
            ...hotelData,
        }).returning();

        if (!hotel) {
            throw new Error("Failed to create hotel");
        }

        if (tags.length !== 0) {
            await drizzle.insert(hotelsTags).values(
                tags.map(tag => ({
                    hotelId: hotel.id,
                    tagId: tag.id
                }))
            )
        }

        const createdTags = await drizzle.select({ id: stags.id, slag: stags.slag }).from(hotelsTags).innerJoin(stags, eq(hotelsTags.tagId, stags.id)).where(eq(hotelsTags.hotelId, hotel.id));

        return { ...hotel, tags: createdTags };
    }

    static async getHotels(limit?: number, sortBy?: string, order?: "asc" | "desc", offset?: number) {
        const hotels = await drizzle.query.hotels.findMany({
            with: {
                tags: true,
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
