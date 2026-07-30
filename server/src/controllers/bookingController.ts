import type { Response, Request } from "express";
import Booking from "@/models/Booking";
import type { AuthenticatedRequest } from "../types/auth";
import { sendResponse, StatusCode } from "@/helpers/response";
import BookingService from "@/services/BookingService";

const createBooking = async (req: AuthenticatedRequest, res: Response) => {
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

    return sendResponse(res, { statusCode: StatusCode.ACCEPTED, payload: { booking } });

}

const getBookingById = async (req: AuthenticatedRequest | Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== "string") {
        return sendResponse(res, { statusCode: StatusCode.BAD_REQUEST, message: "invalid_booking_id" });
    }

    const booking = await Booking.getBookingById(id);

    if(!booking) {
        return sendResponse(res,{ statusCode: StatusCode.NOT_FOUND, message: "booking_not_found" });
    }

}

const getAllBookings = async (_: AuthenticatedRequest | Request, res: Response) => {
    const bookings = await Booking.getAllBookings();
    return sendResponse(res, { statusCode: StatusCode.OK, payload: { bookings } });
}

const getUserBookingsById = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const bookings = await BookingService.getUserBookings(userId);

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { bookings } });
}

export { getBookingById, getUserBookingsById, getAllBookings, createBooking };
