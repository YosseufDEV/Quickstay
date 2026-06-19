import type { Request, Response } from 'express';
import prisma from '../db/prisma';
import { sendResponse, StatusCode } from '../utils/response';

import Hotel from '../models/Hotel';

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

    let limit = Number(req.query.limit);
    let offset = Number(req.query.offset) || 0;

    limit = limit > 10 ? 10 : limit;

    const sort = req.query.sort as string | undefined;
    const order = (req.query.order as "asc" | "desc") || "asc";

    if(limit <= 0 || isNaN(limit) || isNaN(offset)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_pagination_parameters");
    }

    if(sort && !["price", "createdAt", "rating"].includes(sort)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_sort_parameter");
    }

    if(order && !["asc", "desc"].includes(order)) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_order_parameter");
    }

    try {
        const hotels = await Hotel.getHotels(limit, sort, order, offset > 0 ? offset : undefined);

        const meta = { 
            total: hotels.length,
            limit: limit > 10 ? 10 : limit,
            cursor: btoa(hotels.at(-1)?.createdAt.toISOString() || ""),
            sort,
            order
        }

        return sendResponse(res, StatusCode.OK, "", { hotels }, meta)

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

        const hotel = await Hotel.getHotelById(id);

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
