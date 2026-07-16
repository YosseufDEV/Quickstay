import s from "stripe";
import drizzle from "@/db/drizzle";
import { payments } from "@/db/schema";

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
            automatic_payment_methods: {
                enabled: true,
            },
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
}

export default Payment;
