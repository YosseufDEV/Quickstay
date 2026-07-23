import { payments } from "@/db/schema";
import drizzle from "@/db/drizzle";
import { logger } from "@/utils/logger";
import type { Request, Response } from "express";
import s from "stripe";
import { eq } from "drizzle-orm";
import Payment from "@/models/Payment";
import BookingService from "@/services/BookingService";

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

const payBooking = (req: Request, res: Response) => {
    const { bookingId } = req.body;

}

const handleWebHook = async (req: Request, res: Response) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event;
  if (endpointSecret) {
    // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];

        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          logger.warn(`⚠️ Webhook signature verification failed.`, err.message);
          return res.sendStatus(400);
        }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded': {
            const { id: paymentIntentId } = event.data.object;

            logger.info(`Payment intent ${paymentIntentId} succeeded. Confirming booking...`);

            await BookingService.confirmBooking({ paymentIntentId });

            break;
        }

        default:
          logger.warn(`Unhandled event type ${event.type}`);
      }
 }

  res.json({ received: true });
}


export { payBooking, handleWebHook };

