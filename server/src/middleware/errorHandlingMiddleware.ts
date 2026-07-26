import { sendResponse, StatusCode } from "@/helpers/response";
import { AppError } from "@/errors/errors";
import { logger } from "@/utils/logger";

const errorHandlingMiddleware = (err: Error | AppError, req: any, res: any, next: any) => {
    logger.error(`${err.name} occurred: ${err.message}`, { data: { errorName: err.name, ip: req.ip, path: req.path, method: req.method } });
    console.log(err);

    if(err instanceof AppError) {
        logger.debug(`${err.originalError ?? err.message}`, { data: { errorName: err.name, ip: req.ip, path: req.path, method: req.method } });
        return sendResponse(res, err.statusCode, err.message, err.payload);
    }
    logger.debug(`${err}`, { data: { ip: req.ip, path: req.path, method: req.method } });
    return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "internal_server_error");
}

export { errorHandlingMiddleware };
