import express, { Router } from 'express';
import { getAllBookings, getBookingById, book } from '../controllers/bookingController';
import { validateRequest } from '@/middleware/validationMiddleware';
import { bookingSchema } from '@quickstay/validators/src/bookingValidators';
import { checkAuthentication } from '@/middleware/authenticationMiddleware';

const router: Router = express.Router();

router.post("/", checkAuthentication, validateRequest(bookingSchema), book);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);

export default router;
