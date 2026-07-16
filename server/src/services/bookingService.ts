import Booking from "@/models/Booking";
import { logger } from "@/utils/logger";

interface BookingData {
    userId: string;
    roomType: string;
    hotelId: string;
    from: Date;
    to: Date;
}

class BookingService {
    static async createBooking(bookingData: BookingData) {
        const booking = await Booking.book(bookingData);

        logger.info(`
            Created booking for user ${bookingData.userId} in room ${booking.roomId} from ${bookingData.from} to ${bookingData.to} with booking id ${booking.id}`, 
            { 
                data: {
                    ...bookingData,
                    bookingId: booking.id
                } 
            });
    }
}

export default BookingService;
