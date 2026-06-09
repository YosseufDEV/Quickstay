import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";

const checkAuthorization = (policy: (a: any, b?: any) => boolean, getResource?: (req: AuthenticatedRequest) => any) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    const resource = getResource ? getResource(req) : null;

    if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    if(policy(user, resource)) {
        return next();
    }

    return res.sendStatus(403);

}

export { checkAuthorization };
