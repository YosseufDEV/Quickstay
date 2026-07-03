import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";
import { AuthorizationError } from "../errors/errors";

const checkAuthorization = (policy: (a: any, b?: any) => boolean, getResource?: (req: AuthenticatedRequest) => any) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user!;

    const resource = getResource ? getResource(req) : null;

    if(policy(user, resource)) {
        return next();
    }

    throw new AuthorizationError("unauthorized");

}

export { checkAuthorization };
