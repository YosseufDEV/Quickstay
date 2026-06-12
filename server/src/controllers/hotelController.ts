import type { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { sendResponse, StatusCode } from '../utils/response';
import { HotelModel } from '../models/Hotel';

const addHotel = async (req: Request, res: Response) => {
    const { name, imageUrl, rating, address, exactAddress, pricePerNight, tags } = req.body;
    try {
        await prisma.hotel.create({ 
            data: {
                name,
                address,
                rating,
                exactAddress,
                imageUrl,
                pricePerNight,
                tags: {
                    connectOrCreate: tags.map((tag: string) => ({   
                        where: { name: tag },
                        create: { name: tag }
                    }))
                }
            }
        })

    } catch (error) {
    }
}

const getHotels = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10000;
    try {
        const hotels = await HotelModel.getHotels(limit);
        return sendResponse(res, StatusCode.OK, "", { hotels })
    } catch (error) {
        console.log(error);
        return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "An error occurred while fetching hotels");
    }
}

const getHotelById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        if(!id || typeof id !== "string") {
            return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
        }

        const hotel = await HotelModel.getHotelById(id);

        if(!hotel) {
            return sendResponse(res, StatusCode.NOT_FOUND, "hotel_not_found");
        }

        return sendResponse(res, StatusCode.OK, "", { hotel })
    } catch (error) {
        console.log(error);
        return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "An error occurred while fetching the hotel");
    }
}

export { addHotel, getHotels, getHotelById };
