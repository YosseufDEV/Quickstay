import type { Response } from "express";

enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    CONFLICT = 409,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

const sendResponse = (res: Response, status: StatusCode, message?: string, payload?: any, meta? : any) => {
    if(!payload && !message) {
        return res.sendStatus(status);
    }
    return res.status(status).json({ ...(message?.length ? { message } : {} ), payload, meta });
}

export { sendResponse, StatusCode };
