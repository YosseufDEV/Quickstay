import { Router } from 'express';
import { getHotelById, 
         getHotelRoomById, 
         getHotelRoomsById, 
         getHotels, 
         getHotelCatalogById, 
         checkAvailability,
         checkAvailabilityByRoomType
} from '../controllers/hotelController';

const router: Router = Router();

router.get("/", getHotels);
router.get("/:hotelId", getHotelById);
router.get("/:id/rooms", getHotelRoomsById);
router.post("/:hotelId/rooms/:typeId/availability", checkAvailabilityByRoomType);
router.post("/:hotelId/rooms/:roomId", getHotelRoomById);
router.get("/:hotelId/catalog", getHotelCatalogById);
// TODO: Move this to hotelController
router.post("/:hotelId/availability", checkAvailability);

export default router;
