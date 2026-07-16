import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
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
        const { booking, receipt } = await Booking.book(bookingData);

        if(!booking || !receipt) {
            logger.error(`Failed to create booking for user ${bookingData.userId} in room ${bookingData.roomType} from ${bookingData.from} to ${bookingData.to}`, { data: bookingData });
            throw new Error("Failed to create booking");
        }

        const paymentIntent = await Payment.createPaymentIntent({
            bookingId: booking.id,
            userId: booking.userId,
            amount: receipt.totalPrice*100, 
            // TODO: Make currency dynamic based on hotel location or user preference
            currency: "usd"
        });

        logger.info(`
            Created booking for user ${bookingData.userId} in room ${booking.roomId} from ${bookingData.from} to ${bookingData.to} with booking id ${booking.id}`, 
            { 
                data: {
                    ...bookingData,
                    bookingId: booking.id
                } 
            });
        return { booking, receipt, paymentIntentClientSecret: paymentIntent.clientSecret };
    }
}

export default BookingService;
