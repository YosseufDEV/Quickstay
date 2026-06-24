import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { UserRoles } from "../db/schema";
import { logger } from "../utils/logger";

const checkAuthentication = (req: Request & { user?: { id: string, sessionId: string, role: UserRoles } | never }, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if(!token || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "token_not_provided" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
        req.user = { id: decodedToken.userId, sessionId: decodedToken.sessionId, role: decodedToken.role };
        logger.info(`User ${decodedToken.userId} authenticated successfully from IP ${req.ip}`);
        next();
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            logger.error(`JWT error during authentication: ${error.message} for ip ${req.ip}`);
            switch (error.name) {
                case "TokenExpiredError":
                    return res.status(401).json({ message: "token_expired" });
                case "NotBeforeError":
                    return res.status(401).json({ message: "token_not_active" });
                case "JsonWebTokenError":
                    return res.status(401).json({ message: "token_invalid" });
                default:
                    return res.status(401).json({ message: "unknown_token_error" });
            }
        }
    }
}

export { checkAuthentication };
