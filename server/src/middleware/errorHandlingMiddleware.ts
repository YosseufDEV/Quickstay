import { sendResponse, StatusCode } from "../utils/response";
import { AppError } from "@/errors/errors";
import { logger } from "@/utils/logger";

const errorHandlingMiddleware = (err: any, req: any, res: any, next: any) => {
    console.log(err);
    logger.debug(err, { data: { errorName: err.name, ip: req.ip, path: req.path, method: req.method } });
    logger.error(`Error occurred: ${err.message}`, { data: { errorName: err.name, ip: req.ip, path: req.path, method: req.method } });

    if(err instanceof AppError) {
        return sendResponse(res, err.statusCode, err.message);
    }
    return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, "internal_server_error");
}

export { errorHandlingMiddleware };
