import { logger } from "../utils/logger";
import type { Response, Request } from "express";
import Booking from "@/src/models/Booking";
import type { AuthenticatedRequest } from "../types/auth";
import { sendResponse, StatusCode } from "../utils/response";

const createBooking = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { roomId, startDate, endDate } = req.body;

        const bookingData = {
            userId,
            hotelId: roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };

        const booking = await Booking.createBooking(bookingData);

        logger.info(`Created booking for user ${userId} in room ${roomId} from ${startDate} to ${endDate} with booking id ${booking.id} for ip ${req.ip}`, { data: { userId, roomId, startDate, endDate, bookingId: booking.id } });

        return sendResponse(res, StatusCode.CREATED, "", { booking });

    } catch (error) {
        if(typeof error == "object" && error && "message" in error) {
            logger.error(`Error creating booking: ${error.message} for ip ${req.ip}`);
        }
        res.status(500).json({ message: "internal_server_error" });
    }
}

const getBookingById = async (req: AuthenticatedRequest | Request, res: Response) => {
    try {
        const { id } = req.params;
        
        if(!id || typeof id !== "string") {
            return sendResponse(res, StatusCode.BAD_REQUEST, "invalid_booking_id");
        }

        const booking = await Booking.getBookingById(id);

        if(!booking) {
            return sendResponse(res, StatusCode.NOT_FOUND, "booking_not_found");
        }
    }
    catch (error) {
        if(typeof error == "object" && error && "message" in error) {
            logger.error(`Error fetching booking: ${error.message} for ip ${req.ip}`);
        }
    }
}

const getAllBookings = async (req: AuthenticatedRequest | Request, res: Response) => {
    try {
        const bookings = await Booking.getAllBookings();
        return sendResponse(res, StatusCode.OK, "", { bookings });
    } catch (error) {
        if(typeof error == "object" && error && "message" in error) {
            logger.error(`Error fetching bookings: ${error.message} for ip ${req.ip}`);
        }
            return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "internal_server_error");
    }
}

export { createBooking, getBookingById, getAllBookings };
