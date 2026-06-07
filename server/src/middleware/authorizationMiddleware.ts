import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";

const checkAuthorization = (policy: any, resource?: any) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log(user);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if(policy(user, resource)) {
        return next();
    }

    return res.sendStatus(403);

}

export { checkAuthorization };
