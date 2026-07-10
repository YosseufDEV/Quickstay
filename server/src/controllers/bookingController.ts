import { logger } from "../utils/logger";
import type { Response, Request } from "express";
import Booking from "@/models/Booking";
import type { AuthenticatedRequest } from "../types/auth";
import { sendResponse, StatusCode } from "../utils/response";

const book = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { roomType, hotelId, checkIn, checkOut } = req.body;

    const bookingData = {
        userId,
        roomType,
        hotelId,
        from: new Date(checkIn),
        to: new Date(checkOut),
    };

    console.log(typeof checkIn, typeof checkOut);

    const booking = await Booking.book(bookingData);

    logger.info(`
        Created booking for user ${userId} in room ${booking.roomId} from ${checkIn} to ${checkOut} with booking id ${booking.id} for ip ${req.ip}`, 
        { 
            data: 
                { 
                userId, 
                hotelId, 
                checkIn, 
                checkOut, 
                roomType,
                bookingId: booking.id 
            } 
        });

    return sendResponse(res, StatusCode.CREATED, "", { booking });

}

const getBookingById = async (req: AuthenticatedRequest | Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== "string") {
        return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_booking_id");
    }

    const booking = await Booking.getBookingById(id);

    if(!booking) {
        return sendResponse(res, StatusCode.NOT_FOUND, "booking_not_found");
    }

}

const getAllBookings = async (req: AuthenticatedRequest | Request, res: Response) => {
    const bookings = await Booking.getAllBookings();
    return sendResponse(res, StatusCode.OK, "", { bookings });
}

export { getBookingById, getAllBookings, book };
