import { config } from 'dotenv';
config();

import express from 'express';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from "cors";

import AuthRouter from "./routes/authRoutes.ts"
import UserRouter from "./routes/userRoutes.ts"
import HotelRouter from "./routes/hotelRoutes.ts"
import BookingRouter from "./routes/bookingRoutes.ts"
// import PaymentRouter from "./routes/paymentRoutes.ts"
import webhookRouter from "./routes/webHookRoutes.ts"

import { loggingMiddleware } from './middleware/loggingMiddleware.ts';
import { errorHandlingMiddleware } from './middleware/errorHandlingMiddleware.ts';

const app: ReturnType<typeof express> = express();
const router = express.Router();

app.use("/api/v1/webhook", webhookRouter);

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));
app.use(loggingMiddleware);

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/hotels", HotelRouter);
router.use("/bookings", BookingRouter);
// router.use("/payments", PaymentRouter);

app.use("/api/v1", router);
app.use(errorHandlingMiddleware);

export { app };
