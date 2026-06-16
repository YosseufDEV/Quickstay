import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../types/auth";

const checkAuthentication = (req: AuthenticatedRequest, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    console.log("I'm in the authentication middleware");

    if(!token || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "token_not_provided" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
        req.user = { id: decodedToken.userId, sessionId: decodedToken.sessionId, role: decodedToken.role };
        console.log("user is authenticated with id: ", req.user.id);
        next();
    } catch (error) {
        console.log("user is not authenticated:");
        console.log(error);
        if(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            switch (error.name) {
                case "TokenExpiredError":
                    return res.status(401).json({ message: "token_expired" });
                case "NotBeforeError":
                    return res.status(401).json({ message: "token_not_active" });
                case "SyntaxError":
                    return res.status(401).json({ message: "token_malformed" });
                case "VerificationError":
                    return res.status(401).json({ message: "token_signature_invalid" });
                case "JsonWebTokenError":
                    return res.status(401).json({ message: "token_invalid" });
                default:
                    return res.status(401).json({ message: "unknown_token_error" });
            }
        }
    }
}

export { checkAuthentication };
