import prisma from "../db/prisma";

interface Hotel {
    name: string;
    imageUrl: string;
    rating: number;
    address: string;
    exactAddress: string;
    pricePerNight: number;
    tags: { id: number }[];
}

class HotelModel {
    static async createHotel({ tags, ...hotelData }: Hotel) {
        return await prisma.hotel.create({
            data: {
                ...hotelData,
                tags: {
                    connect: tags
                }
            }
        })
    }

    static async getHotels(limit: number) {
        const hotels = await prisma.hotel.findMany({
            take: limit,
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

export { HotelModel };

