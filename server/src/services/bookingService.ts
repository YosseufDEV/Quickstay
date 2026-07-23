import drizzle, { type Transaction } from "@/db/drizzle";
import { hotels, hotelsBookings, hotelsCatalogs, hotelsFees, payments } from "@/db/schema";
import { BookingError } from "@/errors/bookingErrors";
import { AppError } from "@/errors/errors";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { logger } from "@/utils/logger";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { and, eq, sql } from "drizzle-orm";

interface BookingData {
    userId: string;
    roomTypeId: string;
    hotelId: string;
    from: Date;
    to: Date;
}

dayjs.extend(utc);

class BookingService {
    static async createBooking({ userId, roomTypeId, hotelId, from, to } : BookingData) {
        from = dayjs(from).startOf("day").utc().toDate();
        to = dayjs(to).startOf("day").utc().toDate();

        return await drizzle.transaction(async (tx) => {
            const existingBooking =  await tx
                                            .select({
                                                id: hotelsBookings.id,                  
                                                roomId: hotelsBookings.roomId,
                                                userId: hotelsBookings.userId,
                                                timeRange: hotelsBookings.timeRange,
                                                bookingStatus: hotelsBookings.bookingStatus,
                                                stripePaymentIntentId: payments.stripePaymentIntentId,
                                                checkInStatus: hotelsBookings.checkInStatus
                                            })
                                            .from(hotelsBookings)
                                            .where(
                                                and(
                                                    eq(hotelsBookings.timeRange, sql`tstzrange(${from}, ${to}, '[]')`), 
                                                    eq(hotelsBookings.userId, userId), eq(hotelsBookings.roomTypeId, roomTypeId), 
                                                    eq(hotelsBookings.bookingStatus, 'PENDING_PAYMENT')))
                                            .leftJoin(payments, eq(payments.bookingId, hotelsBookings.id))
                                            .then(([booking]) => booking)
                                            .catch((err) => {
                                                console.log(err);
                                                logger.error(`Failed to retrieve existing booking for user ${userId} and room type ${roomTypeId} from ${from} to ${to}`);
                                                throw new BookingError('Failed to retrieve existing booking', 400, err);
                                            });


            const details: Awaited<ReturnType<typeof Booking.createBooking>>["details"] & { stripePaymentIntentId?: string | null } = existingBooking ?? ( await Booking.createBooking({ userId, roomTypeId, hotelId, from, to }, tx) ).details;
            const numberOfNights = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
            const invoice = await BookingService.generateInvoice({ hotelId, roomTypeId, numberOfNights, bookingId: details.id }, tx);

            if(!details || !invoice) {
                logger.error(`Failed to create booking for user ${userId} in type-id ${roomTypeId} from ${from} to ${to}`, { data: { from, to, userId, roomTypeId, hotelId } });
                throw new Error("Failed to create booking");
            }

            const paymentIntent = await Payment.getOrCreatePaymentIntent({
                bookingId: details.id,
                userId,
                amount: invoice.totalPrice * 100, // Convert to cents
                currency: "usd"
            }, tx);

            logger.info(`
                Created booking for user ${userId} in room ${details.roomId} from ${from} to ${to} with id ${details.id}`, 
                { 
                    data: {
                        from, to, userId, roomTypeId, hotelId,
                        bookingId: details.id
                    } 
                });
            return { details, invoice, paymentIntentClientSecret: paymentIntent.clientSecret };
        })
    }

    static async confirmBooking({ paymentIntentId }: { paymentIntentId: string }) {
        return await drizzle.transaction(async (tx) => {
            const payment = await Payment.confirmPaymentIntent(paymentIntentId, tx);

            if(!payment) {
                logger.error(`Failed to confirm payment intent ${paymentIntentId}`);
                throw new AppError("Failed to confirm payment", 402);
            }

            const bookingId = await drizzle.query.payments.findFirst({
                where: {
                    stripePaymentIntentId: paymentIntentId,
                },
                columns: {
                    bookingId: true,
                },
            }).then((payment) => payment?.bookingId);

            if(!bookingId) {
                logger.error(`Failed to find booking for payment intent No booking with this payment intent exists ${paymentIntentId}`);
                throw new AppError("Failed to find booking for payment", 404);
            }

            const booking = await Booking.confirmBooking(bookingId, tx);

            if(!booking || booking.bookingStatus !== "CONFIRMED") {
                logger.error(`Failed to confirm booking ${bookingId} with payment intent ${paymentIntentId}`);
                throw new Error("Failed to confirm booking");
            }

            logger.info(`Booking ${bookingId} confirmed with payment intent ${paymentIntentId}`, { data: { bookingId, paymentIntentId } });
        })
    }

    static async generateInvoice({ hotelId, roomTypeId, numberOfNights, bookingId }: { hotelId: string, roomTypeId: string, numberOfNights: number, bookingId: string }, tx?: Transaction) { 
            return await (tx ?? drizzle).
                            select({
                                bookingId: sql<string>`${bookingId}`,
                                hotelId: hotelsCatalogs.hotelId,
                                roomType: hotelsCatalogs.roomType,
                                pricePerNight: hotelsCatalogs.pricePerNight,
                                numberOfNights: sql<number>`${numberOfNights}`,
                                basePrice: sql<number>`${hotelsCatalogs.pricePerNight} * ${numberOfNights}`,
                                fees: sql<{ type: string, percentage: number }>`json_agg(json_build_object('type', ${hotelsFees.feeType}, 'amount', ${hotelsFees.percentage}))`,
                                totalPrice: sql<number>`CEIL( ${hotelsCatalogs.pricePerNight}*${numberOfNights} * EXP(SUM(LN(1+ ${hotelsFees.percentage}::FLOAT /100 ))) )`,
                                hotel: sql`
                                    json_build_object(
                                        'id', ${hotels.id},
                                        'name', ${hotels.name},
                                        'address', ${hotels.address},
                                        'rating', ${hotels.rating},
                                        'checkInTime', ${hotels.checkInTime},
                                        'checkOutTime', ${hotels.checkOutTime}
                                    )
                                `
                            })                
                            .from(hotelsCatalogs)
                            .where(and(eq(hotelsCatalogs.hotelId, hotelId), eq(hotelsCatalogs.id, roomTypeId)))
                            .leftJoin(hotelsFees, eq(hotelsCatalogs.hotelId, hotelsFees.hotelId))
                            .leftJoin(hotels, eq(hotelsCatalogs.hotelId, hotels.id))
                            .groupBy(hotelsCatalogs.id, hotelsFees.hotelId, hotels.id)
                            .then(([invoice]) => invoice!)
                            .catch((err) => {
                                console.log(err);
                                logger.error(`Failed to generate invoice for booking ${bookingId}`);
                                throw new BookingError('Failed to generate invoice', 400, err);
                            });

    }
}

export default BookingService;
