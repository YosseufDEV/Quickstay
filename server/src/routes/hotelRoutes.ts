import express from 'express';
import { getHotels } from '../controllers/hotelController';

const router = express.Router();

router.get("/", getHotels);

export default router;
