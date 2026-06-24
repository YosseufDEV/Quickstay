import express from 'express';

import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from 'dotenv';

import AuthRouter from "./routes/authRoutes.ts"
import UserRouter from "./routes/userRoutes.ts"
import HotelRouter from "./routes/hotelRoutes.ts"
import BookingRouter from "./routes/bookingRoutes.ts"
import { loggingMiddleware } from './middleware/loggingMiddleware.ts';

config();

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));
app.use(loggingMiddleware);

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/hotels", HotelRouter);
router.use("/bookings", BookingRouter);

app.use("/api/v1", router);

export { app };
