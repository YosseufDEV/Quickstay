import express from 'express';

import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from 'dotenv';

import AuthRouter from "./routes/authRoutes.ts"
import UserRouter from "./routes/userRoutes.ts"
import HotelRouter from "./routes/hotelRoutes.ts"

config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/hotels", HotelRouter);

export { app };
