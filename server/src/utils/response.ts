import type { Response } from "express";

enum StatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

const sendResponse = (res: Response, status: StatusCode, data?: any, message?: string) => {
    if(!data && !message) {
        return res.sendStatus(status);
    }
    return res.status(status).json({ data, message });
}

export { sendResponse, StatusCode };
