import express, { Router } from 'express';
import { getAllBookings, getBookingById, createBooking } from '../controllers/bookingController';
import { validateRequest } from '@/middleware/validationMiddleware';
import { bookingSchema } from '@quickstay/validators/src/bookingValidators';
import { checkAuthentication } from '@/middleware/authenticationMiddleware';

const router: Router = express.Router();

router.post("/", checkAuthentication, validateRequest(bookingSchema), createBooking);
router.get("/", getAllBookings);
router.get("/:userId/bookings", getAllBookings);
router.get("/:id", getBookingById);

export default router;
