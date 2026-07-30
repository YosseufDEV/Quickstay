import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '../helpers/response';
import type { AuthenticatedRequest } from '../types/auth';
import User from '../models/User';
import { logger } from '@/utils/logger';

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== 'string') {
        return sendResponse(res,{ statusCode: StatusCode.BAD_REQUEST, message: "Please enter a valid user Id" });
    }

    const user = await User.getUserById(id);

    if(!user) {
        return sendResponse(res, { statusCode: StatusCode.NOT_FOUND, message: "User not found" });
    }

    sendResponse(res, { statusCode: StatusCode.OK, payload: user })
}

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.getUserById(req.user!.id);

        if(!user) {
            logger.error(`Authenticated user with id ${req.user!.id} not found in database`, { data: { userId: req.user!.id } });
            return sendResponse(res,{ statusCode: StatusCode.NOT_FOUND, message: "user_not_found" });
        }

        return sendResponse(res, { statusCode: StatusCode.OK, payload: { user } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


const getAllUsers = async (_: Request, res: Response) => {
    const users = await User.getAllUsers();
    return sendResponse(res, { statusCode: StatusCode.OK, payload: users });
}

export { getUserById, getAllUsers, getCurrentUser };
