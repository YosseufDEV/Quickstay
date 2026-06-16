import prisma from "../db/prisma";
import { type IHotel } from "@quickstay/types/Hotel"

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

    static async getHotels(start: number, limit?: number) {
        const hotels = await prisma.hotel.findMany({
            ...(limit ? { take: limit } : {}),
            skip: start,
            include: {
                tags: true
            }
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

export { Hotel };

