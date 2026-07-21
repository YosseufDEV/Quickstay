import { payments } from '@/db/schema';
import { logger } from '@/utils/logger';
import drizzle from '@/db/drizzle';
import express, { Router } from 'express';
import s from 'stripe';
import { eq } from 'drizzle-orm';

const router: Router = Router();

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

router.post('/create-payment-intent', async (req, res) => {
    const { bookingId, userId } = req.body;
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event;
  if (endpointSecret) {
    // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];

        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          logger.warn(`⚠️ Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const { id } = event.data.object;
          
          logger.info(`PaymentIntent ${id} succeeded. Updating payment status to PAID.`);
          await drizzle
                .update(payments)
                .set({ status: "PAID" })
                .where(eq(payments.stripePaymentIntentId, id))
                .execute();
          break;
        }

        default:
          logger.warn(`Unhandled event type ${event.type}`);
      }
 }

  response.json({ received: true });

});

export default router;
