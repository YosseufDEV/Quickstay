import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '@/helpers/response';

import Hotel from '../models/Hotel';
import Room from '../models/Room';
import HotelService from '@/services/HotelService';

// TODO: Implement this
const addHotel = async (req: Request, res: Response) => {
    const { name, imageUrl, rating, address, exactAddress, amenities } = req.body;

    try {
        // const hotel = await Hotel.createHotel({
        //     name,
        //     imageUrl,
        //     rating,
        //     address,
        //     exactAddress,
        //     amenities
        // });
        // return sendResponse(res, { statusCode: StatusCode.CREATED, payload: { hotel } }) ;
    } catch (error) {
        console.log(error);
        return sendResponse(res, { statusCode: StatusCode.INTERNAL_SERVER_ERROR, message: "An error occurred while creating the hotel" });
    }
}

const getHotels = async (req: Request, res: Response) => {
    const query = req.query;

    const hotels = await HotelService.getHotels(query);

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { hotels } }) 
}

const getHotelById = async (req: Request, res: Response) => {
    const params = req.params as { hotelId: string };

    const hotel = await HotelService.getHotelById(params);

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { hotel } }) ;
}

const getHotelRoomsById = async (req: Request, res: Response) => {
    // const params = req.params;
    //
    // if(!id || typeof id !== "string") {
    //     return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
    // }
    //
    // const rooms = await Room.getRoomsByHotelId(id);
    //
    // return sendResponse(res, { statusCode: StatusCode.OK, payload: { rooms: rooms } }) ;
}

const getHotelRoomById = async (req: Request, res: Response) => {
    const { hotelId, roomId } = req.params as { hotelId: string, roomId: string };

    if(!hotelId || typeof hotelId !== "string") {
        return sendResponse(res, { statusCode: StatusCode.BAD_REQUEST, message: "hotel_id_required" });
    }

    if(!roomId || typeof roomId !== "string") {
        return sendResponse(res, { statusCode: StatusCode.BAD_REQUEST, message: "room_id_required" });
    }
    
    const room = await Room.getRoomById(roomId);

    if(!room || room.hotelId !== hotelId) {
        return sendResponse(res, { statusCode: StatusCode.NOT_FOUND, message: "room_not_found" });
    }
    
    return sendResponse(res, { statusCode: StatusCode.OK, payload: { room } }) ;
}

const getHotelCatalogById = async (req: Request, res: Response) => {
    // const { hotelId } = safeParseSchema(hotelIdSchema, req.params, res) as { hotelId: string };
    //
    // const catalog = await Hotel.getHotelCatalogById(hotelId);
    //
    // if(!catalog) {
    //     return sendResponse(res, StatusCode.NOT_FOUND, "hotel_catalog_not_found");
    // }
    //
    // return sendResponse(res, { statusCode: StatusCode.OK, payload: { catalog } }) ;
}

const checkAvailability = async (req: Request, res: Response) => {
    const { checkIn, checkOut } = req.body;

    const params = req.params;

    const availability = await HotelService.checkAvailability(params, { checkIn: new Date(checkIn), checkOut: new Date(checkOut) });

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { ...availability } }) ;
}

const checkAvailabilityByRoomType = async (req: Request, res: Response) => {
    const { checkIn, checkOut } = req.body; 

    const availability = await HotelService.checkAvailabilityByTypeId(req.params, { checkIn: new Date(checkIn), checkOut: new Date(checkOut) });

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { ...availability } }) ;
}

const getHotelsCities = async (req: Request, res: Response) => {
    const cities = await HotelService.getHotelsCities();

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { cities } }) ;
}

export { 
    addHotel, 
    getHotels, 
    getHotelById, 
    getHotelRoomsById, 
    getHotelRoomById, 
    getHotelCatalogById, 
    checkAvailability,
    checkAvailabilityByRoomType,
    getHotelsCities
};
