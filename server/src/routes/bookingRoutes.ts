import express from 'express';
import { getAllBookings, getBookingById } from '../controllers/bookingController';

const router = express.Router();

router.get("/:id", getBookingById);
router.get("/", getAllBookings);

export default router;
