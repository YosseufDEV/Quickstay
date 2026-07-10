import { Router } from "express";
import { register, login, refreshToken, logout } from "../controllers/authController.ts";

import { validateRequest } from "../middleware/validationMiddleware.ts";

import { loginSchema, signUpSchema } from "@quickstay/validators/src/userValidators.ts";
import { checkAuthentication } from "../middleware/authenticationMiddleware.ts";

const router: Router = Router();

router.post("/register", validateRequest(signUpSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", checkAuthentication, logout);
router.post('/refresh', refreshToken);

export default router;
