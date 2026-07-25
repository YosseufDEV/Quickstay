import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '@/helpers/response';

import Hotel from '../models/Hotel';
import Room from '../models/Room';
import z, { type ZodSchema } from 'zod';
import BookingService from '@/services/BookingService';

const hotelIdSchema = z.object({
    hotelId: z.uuid("Hotel id is required")
});

const hotelIdRoomIdSchema = z.object({
    hotelId: z.uuid("Hotel id is required"),
    roomId: z.uuid("Room id is required")
});

const safeParseSchema = (schema: ZodSchema, params: Record<any, any>, res: Response) => {
    if(!params) {
        return sendResponse(res, StatusCode.BAD_REQUEST, "request_params_required");
    }

    const result = schema.safeParse(params);

    if(!result.success) {
        const errors = result.error.issues.reduce(((acc: any, issue) => ( { ...acc, [issue.path[0] as string]: issue.message } )), {});
        return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_request_parameters", { errors });
    }

    return result.data;
}

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
        // return sendResponse(res, StatusCode.CREATED, "", { hotel });
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
    const { hotelId } = safeParseSchema(hotelIdSchema, req.params, res) as { hotelId: string };

    const hotel = await Hotel.getHotelById(hotelId);

    if(!hotel) {
        return sendResponse(res, StatusCode.NOT_FOUND, "hotel_not_found");
    }

    return sendResponse(res, StatusCode.OK, "", { hotel })
}

const getHotelRoomsById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!id || typeof id !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "hotel_id_required");
    }

    const rooms = await Room.getRoomsByHotelId(id);

    return sendResponse(res, StatusCode.OK, "", { rooms: rooms });
}

const getHotelRoomById = async (req: Request, res: Response) => {
    const { hotelId, roomId } = safeParseSchema(hotelIdRoomIdSchema, req.params, res) as { hotelId: string, roomId: string };

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

const getHotelCatalogById = async (req: Request, res: Response) => {
    const { hotelId } = safeParseSchema(hotelIdSchema, req.params, res) as { hotelId: string };

    const catalog = await Hotel.getHotelCatalogById(hotelId);

    if(!catalog) {
        return sendResponse(res, StatusCode.NOT_FOUND, "hotel_catalog_not_found");
    }

    return sendResponse(res, StatusCode.OK, "", { catalog });
}

const checkAvailability = async (req: Request, res: Response) => {
    const { hotelId } = safeParseSchema(hotelIdSchema, req.params, res) as { hotelId: string };

    const { checkIn, checkOut } = req.body;

    const availability = await BookingService.checkAvailability({ hotelId, checkIn: new Date(checkIn), checkOut: new Date(checkOut) });

    return sendResponse(res, StatusCode.OK, "", { availability });
}

const checkAvailabilityByRoomType = async (req: Request, res: Response) => {
    const { typeId } = req.params as { hotelId: string, typeId: string };
    const { checkIn, checkOut } = req.body; 

    const availability = await BookingService.checkAvailabilityByTypeId({ roomTypeId: typeId, checkIn: new Date(checkIn), checkOut: new Date(checkOut) });

    return sendResponse(res, StatusCode.OK, "", { availability });
}

export { addHotel, 
         getHotels, 
         getHotelById, 
         getHotelRoomsById, 
         getHotelRoomById, 
         getHotelCatalogById, 
         checkAvailability,
         checkAvailabilityByRoomType
};
