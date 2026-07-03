import jwt from "jsonwebtoken";
import type { Response } from "express";
import { AuthenticationError } from "@/errors/errors.ts";
import { type AuthenticatedRequest } from "@/types/auth";
import { logger } from "../utils/logger";

const checkAuthentication = (req: AuthenticatedRequest, _: Response, next: any) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if(!token || !authHeader.startsWith("Bearer ")) {
        throw new AuthenticationError("token_not_provided");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
        req.user = { id: decodedToken.userId, sessionId: decodedToken.sessionId, role: decodedToken.role };
        logger.info(`User ${decodedToken.userId} authenticated successfully from IP ${req.ip}`);
        next();
    } catch (err) {
        if(err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            switch (err.name) {
                case "TokenExpiredError":
                    throw new AuthenticationError("token_expired");
                case "JsonWebTokenError":
                    throw new AuthenticationError("token_invalid");
                default:
                    throw new AuthenticationError("token_error");
            }
        }
        throw err;
    }
}

export { checkAuthentication };
