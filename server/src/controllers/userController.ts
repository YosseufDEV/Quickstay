import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '../utils/response';
import type { AuthenticatedRequest } from '../types/auth';
import User from '../models/User';
import { logger } from '@/utils/logger';

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== 'string') {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Please enter a valid user Id");
    }

    const user = await User.getUserById(id);

    if(!user) {
        return sendResponse(res, StatusCode.NOT_FOUND, "User not found");
    }

    sendResponse(res, StatusCode.OK, "", user)
}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.getUserById(req.user!.id);

        if(!user) {
            logger.error(`Authenticated user with id ${req.user!.id} not found in database`, { data: { userId: req.user!.id } });
            return sendResponse(res, StatusCode.NOT_FOUND, "user_not_found");

        }

        return sendResponse(res, StatusCode.OK, "", { user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


const getAllUsers = async (_: Request, res: Response) => {
    const users = await User.getAllUsers();
    return sendResponse(res, StatusCode.OK, "", users);
}

export { getUserById, getAllUsers, getCurrentUser };
