import type { Request } from 'express';
import type { UserRoles } from '../db/schema';
export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        sessionId: string;
        role: UserRoles;
    }
}

