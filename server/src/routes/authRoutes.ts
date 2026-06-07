import express from "express";
import { register, login, refreshToken, getCurrentUser, logout } from "../controllers/authController.ts";

import { validateRequest } from "../middleware/validationMiddleware.ts";

import { loginSchema, signUpSchema } from "@quickstay/validators/src/userValidators.ts";
import { checkAuthentication } from "../middleware/authenticationMiddleware.ts";
import { checkAuthorization } from "../middleware/authorizationMiddleware.ts";
import { canViewProtectedContent } from "../policies/testPolicy.ts";

const router = express.Router();

router.post("/register", validateRequest(signUpSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", checkAuthentication, logout);
router.post('/refresh', refreshToken);
router.get('/me', checkAuthentication, getCurrentUser);
router.get("/protected", checkAuthentication, checkAuthorization(canViewProtectedContent), (_, res) => res.status(202).json({ message: "You have access to this protected route!" }));

export default router;
