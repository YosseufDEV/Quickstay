import s from "stripe";
import drizzle, { type Transaction } from "@/db/drizzle";
import { hotelsBookings, hotelsBookingsPayments, payments } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import { logger } from "@/utils/logger";
import { AppError } from "@/errors/errors";

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

interface PaymentIntentData {
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
}

class Payment {
    static getOrCreatePaymentIntent = async (paymentIntentData: PaymentIntentData, tx?: Transaction) => {
        const existingPayment = await (tx ?? drizzle).query.hotelsBookingsPayments.findFirst({
            where: {
                bookingId: paymentIntentData.bookingId,
            },
            with: {
                payment: {
                    columns: {
                        stripePaymentIntentId: true,
                    }
                },
            }
        });
        
        if(existingPayment?.payment?.stripePaymentIntentId) {
            const paymentIntent = await this.getPaymentIntent(existingPayment.payment.stripePaymentIntentId);
            return { clientSecret: paymentIntent.client_secret };
        }
        
        return await this.createPaymentIntent(paymentIntentData, tx);
    }

    static createPaymentIntent = async (paymentIntentData: PaymentIntentData, tx?: Transaction) => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentIntentData.amount,
            payment_method_types: ['card'],
            currency: paymentIntentData.currency,
        })

        const payment = await (tx ?? drizzle).insert(payments).values({
                            stripePaymentIntentId: paymentIntent.id,
                            amount: paymentIntentData.amount,
                            currency: paymentIntentData.currency,
                            status: "PENDING",
                        })
                        .returning()
                        .then(([payment]) => payment!);

        await (tx ?? drizzle).insert(hotelsBookingsPayments).values({
            bookingId: paymentIntentData.bookingId,
            paymentId: payment.id,
        }).catch((err) => {
            logger.error(`Error creating hotelsBookingsPayments record: ${err.message}`);
            throw new AppError({ message: "Error creating hotelsBookingsPayments record", name: "DatabaseError" });
        });

        return { clientSecret: paymentIntent.client_secret };

    }

    static getPaymentIntent = async (stripePaymentIntentId: string) => {
        const paymentIntent =  await stripe.paymentIntents.retrieve(stripePaymentIntentId);

        if(!paymentIntent) {
            throw new AppError({ message: "Payment intent not found or already confirmed", name: "PaymentError" });
        }
        
        return paymentIntent;
    }

    static confirmPaymentIntent = async (stripePaymentIntentId: string, tx: Transaction) => {
        const [updatedPayment] = await (tx ?? drizzle).update(payments).set({ status: "PAID", paidAt: new Date() }).where(and(eq(payments.stripePaymentIntentId, stripePaymentIntentId), not(eq(payments.status, 'PAID')))).returning();

        if(!updatedPayment) {
            throw new AppError({ message: "Payment intent not found or already confirmed", name: "PaymentError" });
        }

        logger.info(`Payment intent ${stripePaymentIntentId} confirmed`);

        return updatedPayment;
    }
}

export default Payment;
