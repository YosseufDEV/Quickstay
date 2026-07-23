import type { Response, Request } from "express";
import Booking from "@/models/Booking";
import type { AuthenticatedRequest } from "../types/auth";
import { sendResponse, StatusCode } from "@/helpers/response";
import BookingService from "@/services/BookingService";

const book = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { roomTypeId, hotelId, checkIn, checkOut } = req.body;

    const bookingData = {
        userId,
        roomTypeId,
        hotelId,
        from: new Date(checkIn),
        to: new Date(checkOut),
    };

    const booking = await BookingService.createBooking(bookingData);

    return sendResponse(res, StatusCode.ACCEPTED, "", { booking });

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
