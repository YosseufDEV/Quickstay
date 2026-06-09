import type { Request, Response } from 'express';
import { sendResponse, StatusCode } from '../utils/response';
import { prisma } from '../db/prisma';

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || typeof id !== 'string') {
        return sendResponse(res, StatusCode.BAD_REQUEST, { message: "Please enter a valid user Id" });
    }

    const user = await prisma.users.findUnique({
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
        return sendResponse(res, StatusCode.NOT_FOUND, { message: "User not found" });
    }

    console.log(user);

    sendResponse(res, StatusCode.OK, user)
}

const getAllUsers = async (req: Request, res: Response) => {
    const users = await prisma.users.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,    
            country: true,
            role: true,
        }
    })
    return sendResponse(res, StatusCode.OK, users);
}

export { getUserById, getAllUsers };
