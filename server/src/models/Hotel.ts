import prisma from "../db/prisma";
import { type IHotel } from "@quickstay/types/Hotel"

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
    static async createHotel({ tags, ...hotelData }: IHotel) {
        return await prisma.hotel.create({
            data: {
                ...hotelData,
                tags: {
                    connect: tags
                }
            }
        })
    }

    static async getHotels(limit?: number, sortBy?: string, order?: "asc" | "desc", offset?: number) {
        const hotels = await prisma.hotel.findMany({
            include: {
                tags: true
            },
            ...(offset ? { 
                skip: offset
            } : {}),
            orderBy: {
                ...getSortingOptions(sortBy, order)
            },
            ...(limit ? { take: limit } : {}),
        });

        return hotels;
    }

    static async getHotelById(id: string) {
        const hotel = await prisma.hotel.findUnique({
            where: {
                id
            },
            include: {
                tags: true
            }
        });

        return hotel;
    }
    
}

export default Hotel;

