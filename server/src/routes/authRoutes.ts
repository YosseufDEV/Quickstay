import express from "express";
import { register, login, refreshToken } from "../controllers/authController.ts";

import { validateRequest } from "../middleware/validationMiddleware.ts";

import { loginSchema, signUpSchema } from "@quickstay/validators/src/userValidators.ts";
import { checkAuthentication } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/register", validateRequest(signUpSchema), register);
router.get("/protected", checkAuthentication, (_, res) => res.sendStatus(202));
router.post("/login", validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);

export default router;
