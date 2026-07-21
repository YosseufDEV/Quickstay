import { handleWebHook } from "@/controllers/paymentController";
import drizzle from "@/db/drizzle";
import { payments } from "@/db/schema";
import { logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import express, { Router } from "express";
import s from "stripe";

const router: Router = Router();

const stripe = new s(process.env.STRIPE_SECRET_KEY as string);

router.post("/", express.raw({ type: "application/json" }), handleWebHook);

export default router;
