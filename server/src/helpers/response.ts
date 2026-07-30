import { Optional } from "@/utils/optional";
import type { Response } from "express";

enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    CONFLICT = 409,
    FORBIDDEN = 403,
    UNPROCESSABLE_ENTITY = 422,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface ResponseOptions {
    statusCode: StatusCode;
    message?: string;
    payload?: any;
    errors?: any;
    meta?: any;
}

const sendResponse = (res: Response,  { statusCode, message, payload, errors, meta }: ResponseOptions) => {
    if(!message && !payload && !errors && !meta) {
        return res.sendStatus(statusCode);
    }

    return res.status(statusCode).json({ ...Optional("message", message, message), payload, meta, errors });
}

export { sendResponse, StatusCode };
