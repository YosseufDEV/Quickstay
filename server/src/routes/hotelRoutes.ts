import { Router } from 'express';
import { getHotelById, getHotelRoomById, getHotelRoomsById, getHotels, getHotelCatalogById } from '../controllers/hotelController';

const router: Router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);
router.get("/:id/rooms", getHotelRoomsById);
router.get("/:hotelId/rooms/:roomId", getHotelRoomById);
router.get("/:hotelId/catalog", getHotelCatalogById);

export default router;
