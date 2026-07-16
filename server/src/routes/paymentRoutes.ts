import { Router } from 'express';
import s from 'stripe';

const router: Router = Router();

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

router.post('/create-payment-intent', async (req, res) => {
    const { bookingId, userId } = req.body;
})

export default router;
