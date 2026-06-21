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

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));
app.use(loggingMiddleware);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/hotels", HotelRouter);
app.use("/api/v1/bookings", BookingRouter);

export { app };
