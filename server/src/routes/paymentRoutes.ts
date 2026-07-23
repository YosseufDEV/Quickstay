import { payments } from '@/db/schema';
import { logger } from '@/utils/logger';
import drizzle from '@/db/drizzle';
import express, { Router } from 'express';
import s from 'stripe';
import { eq } from 'drizzle-orm';
import BookingService from '@/services/bookingService';

const router: Router = Router();

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

router.post('/create-payment-intent', async (req, res) => {
    const { bookingId, userId } = req.body;
})

export default router;
