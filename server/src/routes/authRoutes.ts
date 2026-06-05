import express from "express";
import { register, login, refreshToken, getCurrentUser } from "../controllers/authController.ts";

import { validateRequest } from "../middleware/validationMiddleware.ts";

import { loginSchema, signUpSchema } from "@quickstay/validators/src/userValidators.ts";
import { checkAuthentication } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/register", validateRequest(signUpSchema), register);
router.get("/protected", checkAuthentication, (_, res) => res.status(202).json({ message: "You have access to this protected route!" }));
router.post("/login", validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', checkAuthentication, getCurrentUser);

export default router;
