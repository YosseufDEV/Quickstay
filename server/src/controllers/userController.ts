import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '../utils/response';
import prisma from '../db/prisma';

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== 'string') {
        return sendResponse(res, StatusCode.BAD_REQUEST, "Please enter a valid user Id");
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            country: true,
            role: true,
        }
    });

    if(!user) {
        return sendResponse(res, StatusCode.NOT_FOUND, "User not found");
    }

    console.log(user);

    sendResponse(res, StatusCode.OK, "", user)
}

const getAllUsers = async (_: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,    
            country: true,
            role: true,
        }
    })
    return sendResponse(res, StatusCode.OK, "", users);
}

export { getUserById, getAllUsers };
