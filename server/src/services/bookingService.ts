import drizzle, { type Transaction } from "@/db/drizzle";
import { hotels, hotelsBookings, hotelsCatalogs, hotelsFees, payments, hotelsBookingsPayments } from "@/db/schema";
import { BookingError } from "@/errors/bookingErrors";
import { AppError } from "@/errors/errors";
import Booking, { type BookingResponse } from "@/models/Booking";
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
                                                checkInStatus: hotelsBookings.checkInStatus,
                                                hotel: {
                                                    id: hotels.id,
                                                    name: hotels.name,
                                                    address: hotels.address,
                                                    rating: hotels.rating,
                                                    checkInTime: hotels.checkInTime,
                                                    checkOutTime: hotels.checkOutTime
                                                },
                                            })
                                            .from(hotelsBookings)
                                            .where(
                                                and(
                                                    eq(hotelsBookings.timeRange, sql`tstzrange(${from}, ${to}, '[)')`), 
                                                    eq(hotelsBookings.userId, userId), eq(hotelsBookings.roomTypeId, roomTypeId), 
                                                    eq(hotelsBookings.bookingStatus, 'PENDING_PAYMENT')))
                                            .leftJoin(hotelsBookingsPayments, eq(hotelsBookings.id, hotelsBookingsPayments.bookingId))
                                            .leftJoin(payments, eq(hotelsBookingsPayments.paymentId, payments.id))
                                            .leftJoin(hotels, eq(hotelsBookings.hotelId, hotels.id))
                                            .then(([booking]) => booking as BookingResponse["details"])
                                            .catch((err) => {
                                                logger.error(`Failed to retrieve existing booking for user ${userId} and room type ${roomTypeId} from ${from} to ${to}`);
                                                throw new BookingError('Failed to retrieve existing booking', 400, err);
                                            });

            const details: BookingResponse["details"] & { stripePaymentIntentId?: string | null } = existingBooking ?? ( await Booking.createBooking({ userId, roomTypeId, hotelId, from, to }, tx) ).details;
            const numberOfNights = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
            const invoice = await BookingService.generateInvoice({ hotelId, roomTypeId, numberOfNights, bookingId: details.id }, tx)!;

            if(!details || !invoice) {
                logger.error(`Failed to create booking for user ${userId} in type-id ${roomTypeId} from ${from} to ${to}`, { data: { from, to, userId, roomTypeId, hotelId } });
                throw new Error("Failed to create booking");
            }

            // INFO: This returns the existing payment intent if a booking-payment record exists, otherwise it creates a new payment intent and returns the client secret for the frontend to use.
            const paymentIntent = await Payment.getOrCreatePaymentIntent({
                bookingId: details.id,
                userId,
                amount: invoice.totalPrice * 100, // INFO: Convert to cents
                currency: invoice.currency
            }, tx);

            logger.info(`
                Created booking for user ${userId} in room ${details.roomId} from ${from} to ${to} with id ${details.id}`, 
                { 
                    data: {
                        from, to, userId, roomTypeId, hotelId,
                        bookingId: details.id
                    } 
                });
            return { ...{ details }, invoice, paymentIntentClientSecret: paymentIntent.clientSecret };
        })
    }

    static async confirmBooking({ paymentIntentId }: { paymentIntentId: string }) {
        return await drizzle.transaction(async (tx) => {
            const payment = await Payment.confirmPaymentIntent(paymentIntentId, tx);

            if(!payment) {
                logger.error(`Failed to confirm payment intent ${paymentIntentId}`);
                throw new AppError({ message: "Failed to confirm payment", statusCode: 402, name: "BookingPaymentError" });
            }

            const bookingId = await tx.query.hotelsBookingsPayments.findFirst({
                where: {
                        paymentId: payment.id,
                },
                columns: {
                    bookingId: true,
                },
            }).then((payment) => payment?.bookingId);

            if(!bookingId) {
                logger.error(`Failed to find booking for payment intent No booking with this payment intent exists ${paymentIntentId}`);
                throw new AppError({ message: "Failed to find booking for payment", statusCode: 404, name: "BookingPaymentError" });
            }

            const booking = await Booking.confirmBooking(bookingId, tx);

            if(!booking || booking.bookingStatus !== "CONFIRMED") {
                logger.error(`Failed to confirm booking ${bookingId} with payment intent ${paymentIntentId}`);
                throw new AppError({ message: "Failed to confirm booking", name: "BookingPaymentError", statusCode: 400 });
            }

            logger.info(`Booking ${bookingId} confirmed with payment intent ${paymentIntentId}`, { data: { bookingId, paymentIntentId } });
        })
    }

    static async getUserBookings(userId: string) {
        return await drizzle
                        .select()
                        .from(hotelsBookings)
                        .where(eq(hotelsBookings.userId, userId))
                        .then((bookings) => bookings as BookingResponse["details"][])
                        .catch((err) => {
                            logger.error(`Failed to retrieve bookings for user ${userId}`);
                            throw new BookingError('Failed to retrieve bookings', 400, err);
                        });
    }

    static async createBookingPaymentRecord({ bookingId, paymentId }: { bookingId: string, paymentId: string }, tx?: Transaction) {
        return await (tx ?? drizzle)
                        .insert(hotelsBookingsPayments)
                        .values({
                            bookingId,
                            paymentId,
                        })
                        .then(() => true)
                        .catch((err) => {
                            logger.error(`Failed to create booking-payment record for booking ${bookingId} and payment ${paymentId}`);
                            throw new BookingError('Failed to create booking-payment record', 400, err);
                        });
    }

    static async generateInvoice({ hotelId, roomTypeId, numberOfNights, bookingId }: { hotelId: string, roomTypeId: string, numberOfNights: number, bookingId: string }, tx?: Transaction) { 
            return await (tx ?? drizzle).
                            select({
                                bookingId: sql<string>`${bookingId}`,
                                hotelId: hotelsCatalogs.hotelId,
                                currency: hotels.currency,
                                roomType: hotelsCatalogs.roomType,
                                pricePerNight: hotelsCatalogs.pricePerNight,
                                numberOfNights: sql<number>`${numberOfNights}::INT`,
                                basePrice: sql<number>`${hotelsCatalogs.pricePerNight} * ${numberOfNights}`,
                                fees: sql<{ type: string, percentage: number }>`json_agg(json_build_object('type', ${hotelsFees.feeType}, 'amount', ${hotelsFees.percentage}))`,
                                totalPrice: sql<number>`CEIL( ${hotelsCatalogs.pricePerNight}*${numberOfNights} * EXP(SUM(LN(1+ ${hotelsFees.percentage}::FLOAT /100 ))) )`,
                            })                
                            .from(hotelsCatalogs)
                            .where(and(eq(hotelsCatalogs.hotelId, hotelId), eq(hotelsCatalogs.id, roomTypeId)))
                            .innerJoin(hotels, eq(hotelsCatalogs.hotelId, hotels.id))
                            .leftJoin(hotelsFees, eq(hotelsCatalogs.hotelId, hotelsFees.hotelId))
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
