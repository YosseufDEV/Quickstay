import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../db/prisma";

import type { AuthenticatedRequest } from "../types/auth";
import { insertSession, invalidateSession, isSessionValid, rotateToken } from "./sessionController";
import { generateToken } from "../utils/token";
import { turnIntoTimestamp } from "../utils/time";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "15m";
const JWT_REFRESH_EXPIRATION_TIME = process.env.JWT_REFRESH_EXPIRATION_TIME || "30d";

const JWT_REFRESH_EXPIRATION_TIME_MS = turnIntoTimestamp(JWT_REFRESH_EXPIRATION_TIME);

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return res.status(400).json({ message: "token_not_provided" });

    try {
        const usedToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        const payload = { userId: usedToken.userId, sessionId: usedToken.sessionId };

        const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
        const newRefreshToken = generateToken({ ... payload, exp: usedToken.exp }, JWT_REFRESH_SECRET);

        const sessionValid = await isSessionValid(refreshToken, payload);

        if(!sessionValid.valid) {
            return res.status(400).json({ message: sessionValid.reason});
        }

        const expirationTime = usedToken.exp ? (usedToken.exp - Date.now()/1000) : JWT_REFRESH_EXPIRATION_TIME_MS/1000;

        await rotateToken(refreshToken, payload);
        await insertSession(newRefreshToken as string, payload, expirationTime);

        res.cookie("refreshToken", newRefreshToken, { sameSite: "strict", httpOnly: true, secure: true, maxAge: JWT_REFRESH_EXPIRATION_TIME_MS });
        
        console.log("New refresh token issued for user ", payload.userId, " with session ", payload.sessionId);

        return res.status(200).json({ accessToken });

    } catch (error) {
        console.log(error);
         if(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            switch (error.name) {
                case "TokenExpiredError":
                    return res.status(401).json({ message: "token_expired" });
                case "NotBeforeError":
                    return res.status(401).json({ message: "token_not_active" });
                case "SyntaxError":
                    return res.status(401).json({ message: "token_malformed" });
                case "JsonWebTokenError":
                    return res.status(401).json({ message: "token_invalid" });
                default:
                    return res.status(401).json({ message: "unknown_token_error" });
            }
        }
    }
}

const register = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, country } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });

        const salt = bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, await salt);

        if(existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await prisma.users.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                country
            },
        });

        res.status(201).json({ data: user });
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const login = async (req: Request, res: Response) => {    
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if(!user) return res.status(404).json({ message: "user_not_found" });
        
        if(!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: "invalid_email_password" });
        
        const payload = { userId: user.id, sessionId: crypto.randomUUID(), role: user.role };

        const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
        const refreshToken = generateToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_TIME);

        await insertSession(refreshToken as string, payload, JWT_REFRESH_EXPIRATION_TIME_MS/1000);

        res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: turnIntoTimestamp(JWT_REFRESH_EXPIRATION_TIME) });

        return res.status(200).json({ accessToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, country: user.country, role: user.role } });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const logout = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) return res.status(401).json({ message: "Unauthorized" });
    await invalidateSession({ userId: req.user.id, sessionId: req.user.sessionId });
    res.clearCookie("refreshToken", { sameSite: "strict", httpOnly: true, secure: true });
    return res.status(200).json({ message: "Logged out successfully" });
}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) return res.status(401).json({ message: "Unauthorized" });


    const userId = req.user.id; 

    try {
        const user = await prisma.users.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, country: true } });

        if(!user) {
            return res.status(404).json({ message: "user_not_found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export { login, register, refreshToken, getCurrentUser, logout }
