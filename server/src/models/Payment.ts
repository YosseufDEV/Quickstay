import s from "stripe";
import drizzle from "@/db/drizzle";
import { hotelsBookings, payments } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import { logger } from "@/utils/logger";

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

interface PaymentIntentData {
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
}

// TODO: Implement Idempotency key for payment intent creation to avoid duplicate charges in case of network issues or retries.
class Payment {
    static createPaymentIntent = async (paymentIntentData: PaymentIntentData) => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentIntentData.amount,
            payment_method_types: ['card'],
            currency: paymentIntentData.currency,
        })

        await drizzle.insert(payments).values({
            bookingId: paymentIntentData.bookingId,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntentData.amount,
            currency: paymentIntentData.currency,
            status: "PENDING",
        });

        return { clientSecret: paymentIntent.client_secret };

    }

    static confirmPaymentIntent = async (stripePaymentIntentId: string) => {
        await drizzle.transaction(async (tx) => {
            const [updatedPayment] = await tx.update(payments).set({ status: "PAID", paidAt: new Date() }).where(and(eq(payments.stripePaymentIntentId, stripePaymentIntentId), not(eq(payments.status, 'PAID')))).returning();

            if(!updatedPayment) {
                throw new Error("Payment intent not found or already confirmed");
            }

            await tx.update(hotelsBookings).set({ bookingStatus: "CONFIRMED" }).where(eq(hotelsBookings.id, updatedPayment.bookingId));

            logger.info(`Payment intent ${stripePaymentIntentId} confirmed and booking ${updatedPayment.bookingId} status updated to CONFIRMED`);

        })
    }
}

export default Payment;
