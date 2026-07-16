import type { Request, Response } from "express";
import s from "stripe";

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

const payBooking = (req: Request, res: Response) => {
    const { bookingId } = req.body;

}

export { payBooking };

