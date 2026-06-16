import type { Role } from '@/generated/prisma/enums';
import type { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        sessionId: string;
        role: Role;
    }
}

