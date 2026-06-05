import express from 'express';

import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from 'dotenv';
import { prisma } from './db/prisma';
import redis from "./db/redis";


import AuthRoutes from "./routes/authRoutes.ts"

config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, methods: "GET,POST,PUT,DELETE", credentials: true }));

app.use("/auth", AuthRoutes);

const PORT = process.env.PORT || 5050;

await prisma.$connect().then(() => console.log('Connected to the database')).catch((error) => console.error('Database connection error:', error));
await redis.connect().then(() => console.log('Connected to Redis')).catch((error) => console.error('Redis connection error:', error));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
