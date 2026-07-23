import { logger } from "@/utils/logger";
import z from "zod";

const bookingSchema = z.object({
    roomTypeId: z.uuid("Please enter a valid Room-Type Id").min(1, { message: "Room type is required" }),
    hotelId: z.uuid("Please enter a valid Hotel Id").min(1, { message: "Hotel ID is required" }),
    // FIX: Doesn't work if day is today
    checkIn: z.coerce
                .date("Please Enter a valid Check-in Date")
                .transform(date => new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
                .refine(date => date.getTime() >= new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
                {
                    message: "Check-in date must be today or later",
                }),
    checkOut: z.coerce.date("Please Enter a valid Check-out Date").refine(date => date.getTime() >= new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 24 * 60 * 60 * 1000,
                {
                    message: "Check-out date must be at least a day later than today",
                }),
}).refine(data => data.checkOut > data.checkIn, {
    message: "Check-out date must be later than check-in date",
    path: ["checkOut"],
});

export { bookingSchema };
