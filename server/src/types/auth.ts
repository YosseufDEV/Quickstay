import type { Request } from 'express';
import type { UserRole } from '../db/schema';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        sessionId: string;
        role: UserRole;
    }
}

