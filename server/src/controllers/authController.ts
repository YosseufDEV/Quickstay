import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import type { AuthenticatedRequest } from "../types/auth";
import { AuthenticationError, UserError, TokenRefreshError } from "@/errors/errors";
import { insertSession, invalidateSession, isSessionValid } from "./sessionController";
import { generateToken } from "../utils/token";
import { turnIntoTimestamp } from "../utils/time";
import { sendResponse, StatusCode } from "@/helpers/response";
import User from "../models/User";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "15m";
const JWT_REFRESH_EXPIRATION_TIME = process.env.JWT_REFRESH_EXPIRATION_TIME || "30d";

const JWT_REFRESH_EXPIRATION_TIME_MS = turnIntoTimestamp(JWT_REFRESH_EXPIRATION_TIME);

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return sendResponse(res, { statusCode: StatusCode.BAD_REQUEST, message: "no_token_provided" });

    try {
        const usedToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        const payload = { userId: usedToken.userId, sessionId: usedToken.sessionId, role: usedToken.role };

        const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
        const newRefreshToken = generateToken({ ... payload, exp: usedToken.exp }, JWT_REFRESH_SECRET);

        const sessionValid = await isSessionValid(refreshToken, payload);

        if(!sessionValid.valid) {
            return sendResponse(res, { statusCode: StatusCode.BAD_REQUEST, message: sessionValid.reason || "invalid_session" });
        }

        const expirationTime = usedToken.exp ? (usedToken.exp - Date.now()/1000) : JWT_REFRESH_EXPIRATION_TIME_MS/1000;

        res.cookie("refreshToken", newRefreshToken, { sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV == "production", maxAge: JWT_REFRESH_EXPIRATION_TIME_MS });

        await insertSession(newRefreshToken as string, payload, expirationTime);

        return sendResponse(res, { statusCode: StatusCode.OK, payload: { accessToken } });

    } catch (error) {
         if(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            switch (error.name) {
                case "TokenExpiredError":
                    throw new TokenRefreshError({ message: "token_expired" });
                case "NotBeforeError":
                    throw new TokenRefreshError({ message: "token_not_active" });
                case "JsonWebTokenError":
                    throw new TokenRefreshError({ message: "token_invalid" });
                default:
                    throw new TokenRefreshError({ message: "unknown_token_error" });
            }
        }
        throw error;
    }
}

const register = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, country } = req.body;

    const existingUser = await User.getUserByEmail(email);

    if(existingUser) throw new UserError({ message: "email_already_in_use", statusCode: StatusCode.CONFLICT });

    const user = await User.createUser({ email, firstName, lastName, password, country });

    return sendResponse(res, { statusCode: StatusCode.CREATED, payload: { user } });
}


const login = async (req: Request, res: Response) => {    
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email);

    if(!user) throw new AuthenticationError({ message: "invalid_credentials" });
    
    if(!await bcrypt.compare(password, user.password)) throw new AuthenticationError({ message: "invalid_credentials" });
    
    const payload = { userId: user.id, sessionId: crypto.randomUUID(), role: user.role };

    const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
    const refreshToken = generateToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_TIME);

    await insertSession(refreshToken as string, payload, JWT_REFRESH_EXPIRATION_TIME_MS/1000);

    res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: JWT_REFRESH_EXPIRATION_TIME_MS, secure: process.env.NODE_ENV == "production" });

    return sendResponse(res, { statusCode: StatusCode.OK, payload: { accessToken, user: { ...user, password: undefined } } });
}

const logout = async (req: AuthenticatedRequest, res: Response) => {
    await invalidateSession({ userId: req.user!.id, sessionId: req.user!.sessionId });

    res.clearCookie("refreshToken", { sameSite: "strict", httpOnly: true, secure: process.env.NODE_ENV == "production" });

    return sendResponse(res, { statusCode: StatusCode.OK });
}

export { login, register, refreshToken, logout }
