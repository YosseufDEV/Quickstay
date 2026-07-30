import { type Request, Router } from 'express';
import { getUserBookingsById } from '../controllers/bookingController';
import { getAllUsers, getUserById, getCurrentUser } from '../controllers/userController';
import { checkAuthentication } from '../middleware/authenticationMiddleware';
import { checkAuthorization } from '../middleware/authorizationMiddleware';
import { canGetAllUsers, canGetUser, canGetUserBookings } from '../policies/userPolicies';

const router: Router = Router();

router.get("/", checkAuthentication, checkAuthorization(canGetAllUsers), getAllUsers);
router.get("/me", checkAuthentication, getCurrentUser);
router.get("/:id", checkAuthentication, 
                   checkAuthorization(canGetUser, (req: Request) => req.params.id), 
                   getUserById
);
router.get("/:userId/bookings", checkAuthentication, checkAuthorization(canGetUserBookings, (req) => req.params.userId ), getUserBookingsById);

export default router;
