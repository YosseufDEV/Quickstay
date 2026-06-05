import type { Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/token";
import { turnIntoTimestamp } from "../utils/time";
import { prisma } from "../db/prisma";
import { insertSession, isSessionValid } from "./sessionController";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "15m";
const JWT_REFRESH_EXPIRATION_TIME = process.env.JWT_REFRESH_EXPIRATION_TIME || "30d";

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    console.log("Received refresh token:", refreshToken);

    if(!refreshToken) return res.status(401).json({ message: "token_not_provided" });

    try {
        const usedToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        const payload = { userId: usedToken.userId, sessionId: usedToken.sessionId };

        const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
        const newRefreshToken = generateToken({ ... payload, exp: usedToken.exp }, JWT_REFRESH_SECRET);

        const sessionValid = await isSessionValid(payload.userId, payload.sessionId, refreshToken);

        if(!sessionValid.valid) {
            return res.status(401).json({ message: sessionValid.reason});
        }

        console.log(newRefreshToken);

        await insertSession(newRefreshToken as string, payload);

        res.cookie("refreshToken", newRefreshToken, { sameSite: "strict", httpOnly: true, secure: true, maxAge: turnIntoTimestamp(JWT_REFRESH_EXPIRATION_TIME) });

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

const login = async (req: Request, res: Response) => {    
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if(!user) return res.status(404).json({ message: "user_not_found" });
        
        if(!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: "invalid_email_password" });
        
        const payload = { userId: user.id, sessionId: crypto.randomUUID() };

        const accessToken = generateToken(payload, JWT_ACCESS_SECRET, JWT_EXPIRATION_TIME);
        const refreshToken = generateToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_TIME);
        await insertSession(refreshToken as string, payload);

        res.cookie("refreshToken", refreshToken, { sameSite: "strict", httpOnly: true, maxAge: turnIntoTimestamp(JWT_REFRESH_EXPIRATION_TIME) });

        return res.status(200).json({ accessToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, country: user.country } });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const register = async (req: Request, res: Response) => {
    const { email, firstName, lastName, password, country } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });

        const salt = bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, await salt);

        if(existingUser) {
            return res.status(400).json({ status: "error", message: "Email already in use" });
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

        res.status(201).json({ status: "success", data: user });
    } catch(error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export { login, register, refreshToken }
