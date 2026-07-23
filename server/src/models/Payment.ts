import s from "stripe";
import drizzle, { type Transaction } from "@/db/drizzle";
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
    static getOrCreatePaymentIntent = async (paymentIntentData: PaymentIntentData, tx?: Transaction) => {
        const existingPayment = await (tx ?? drizzle).query.payments.findFirst({
            where: {
                bookingId: paymentIntentData.bookingId,
            },
        });
        
        if(existingPayment) {
            const paymentIntent = await this.getPaymentIntent(existingPayment.stripePaymentIntentId);
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

        await (tx ?? drizzle).insert(payments).values({
            bookingId: paymentIntentData.bookingId,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntentData.amount,
            currency: paymentIntentData.currency,
            status: "PENDING",
        });

        return { clientSecret: paymentIntent.client_secret };

    }

    static getPaymentIntent = async (stripePaymentIntentId: string) => {
        const paymentIntent =  await stripe.paymentIntents.retrieve(stripePaymentIntentId);

        if(!paymentIntent) {
            throw new Error(`Payment intent ${stripePaymentIntentId} not found`);
        }
        
        return paymentIntent;
    }

    static confirmPaymentIntent = async (stripePaymentIntentId: string, tx: Transaction) => {
        const [updatedPayment] = await (tx ?? drizzle).update(payments).set({ status: "PAID", paidAt: new Date() }).where(and(eq(payments.stripePaymentIntentId, stripePaymentIntentId), not(eq(payments.status, 'PAID')))).returning();

        if(!updatedPayment) {
            throw new Error("Payment intent not found or already confirmed");
        }

        logger.info(`Payment intent ${stripePaymentIntentId} confirmed and booking ${updatedPayment.bookingId} status updated to CONFIRMED`);
        return updatedPayment;
    }
}

export default Payment;
