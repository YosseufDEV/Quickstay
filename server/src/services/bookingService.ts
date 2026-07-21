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
        const { details, receipt } = await Booking.book(bookingData);

        if(!details || !receipt) {
            logger.error(`Failed to create booking for user ${bookingData.userId} in room ${bookingData.roomType} from ${bookingData.from} to ${bookingData.to}`, { data: bookingData });
            throw new Error("Failed to create booking");
        }

        const paymentIntent = await Payment.createPaymentIntent({
            bookingId: details.id,
            userId: details.userId,
            amount: receipt.totalPrice*100, 
            // TODO: Make currency dynamic based on hotel location or user preference
            currency: "usd"
        });

        logger.info(`
            Created booking for user ${bookingData.userId} in room ${details.roomId} from ${bookingData.from} to ${bookingData.to} with id ${details.id}`, 
            { 
                data: {
                    ...bookingData,
                    bookingId: details.id
                } 
            });
        return { details, receipt, paymentIntentClientSecret: paymentIntent.clientSecret };
    }
}

export default BookingService;
