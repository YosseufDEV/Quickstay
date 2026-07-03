import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '../utils/response';

import Hotel from '../models/Hotel';
import Room from '../models/Room';

// TODO: Fix this
const addHotel = async (req: Request, res: Response) => {
    const { name, imageUrl, rating, address, exactAddress, pricePerNight, tags } = req.body;
    try {
        const hotel = await Hotel.createHotel({
            name,
            imageUrl,
            rating,
            address,
            exactAddress,
            pricePerNight,
            tags
        });
        return sendResponse(res, StatusCode.CREATED, "", { hotel });
    } catch (error) {
        console.log(error);
        return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "An error occurred while creating the hotel");
    }
}

const getHotels = async (req: Request, res: Response) => {

    let limit = Math.min(Math.abs(Number(req.query.limit)), 30) || 30;
    let offset = Number(req.query.offset) || 0;

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

    const hotels = await Hotel.getHotels(limit, offset > 0 ? offset : 0, sort, order);

    return sendResponse(res, StatusCode.OK, "", { hotels })
}

const getHotelById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id || typeof id !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
    }

    const hotel = await Hotel.getHotelById(id);

    if(!hotel) {
        return sendResponse(res, StatusCode.NOT_FOUND, "hotel_not_found");
    }

    return sendResponse(res, StatusCode.OK, "", { hotel })
}

const getHotelRoomsById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const availableOnly = req.query.availableOnly === "true" || false;

    if(!id || typeof id !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
    }

    return sendResponse(res, StatusCode.OK, "", { rooms: await Room.getRoomsByHotelId(id, availableOnly) });
}

const getHotelRoomById = async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId;
    const roomId = req.params.roomId;

    if(!hotelId || typeof hotelId !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
    }

    if(!roomId || typeof roomId !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "room_id_required");
    }
    
    const room = await Room.getRoomById(roomId);

    if(!room || room.hotelId !== hotelId) {
        return sendResponse(res, StatusCode.NOT_FOUND, "room_not_found");
    }
    
    return sendResponse(res, StatusCode.OK, "", { room });
}

export { addHotel, getHotels, getHotelById, getHotelRoomsById, getHotelRoomById };
