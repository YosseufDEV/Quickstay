import prisma from "../db/prisma";
import { insertBooking, getAllBookings, getBookingById } from "@/generated/prisma/sql";
import type { HotelBooking } from "@/generated/prisma/client";
import camelcaseKeys from "camelcase-keys";

interface BookingData {
    userId: string;
    hotelId: string;
    startDate: Date;
    endDate: Date;
}

class Booking {
    static parseTSRangeToDates(tsrange: string) {
        if(!tsrange || typeof tsrange !== 'string') {
            // throw new Error(`Invalid tsrange format: ${tsrange}`);
            return { }
        }

        const regex = /^[\[(]"?([^",)]*)"?,"?([^",)\]]*)"?[\])]$/;
        const match = tsrange.match(regex);

        if (!match || !match[1] || !match[2]) {
            // throw new Error(`Invalid tsrange format: ${tsrange}`);
            return { } 
        }

        return {
            from: new Date(match[1]),
            to: new Date(match[2])
        };
    }

    static async createBooking(data: BookingData): Promise<HotelBooking> {
        return await prisma.$queryRawTyped(insertBooking(data.userId, data.hotelId, data.startDate, data.endDate)) as unknown as HotelBooking;
    }

    static async  getBookingById(id: string) {
        return await prisma.hotelBooking.findUnique({
            where: {
                id
            },
            include: {
                hotel: true,
                user: true
            }
        });
    }

    // TODO: add pagination and filtering
    static async  getAllBookings() {
        const bookings =  await prisma.$queryRawTyped(getAllBookings());

        bookings.forEach(booking => {
            const { from, to } = Booking.parseTSRangeToDates(booking.from_to);

            booking.from = from;
            booking.to = to;
        });
        return camelcaseKeys(bookings, { deep: true });
    }
}

export default Booking;
