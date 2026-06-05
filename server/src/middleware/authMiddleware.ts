import jwt from "jsonwebtoken";

const checkAuthentication = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "token_not_provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as jwt.JwtPayload;
        req.user = { id: decodedToken.userId, sessionId: decodedToken.sessionId };
        console.log("user is authenticated with id: ", req.user.id);
        next();
    } catch (error) {
        console.log("user is not authenticated:");
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
