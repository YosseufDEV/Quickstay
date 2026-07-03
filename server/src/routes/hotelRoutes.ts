import express from 'express';
import { getHotelById, getHotelRoomById, getHotelRoomsById, getHotels } from '../controllers/hotelController';

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);
router.get("/:id/rooms", getHotelRoomsById);
router.get("/:hotelId/rooms/:roomId", getHotelRoomById);

export default router;
