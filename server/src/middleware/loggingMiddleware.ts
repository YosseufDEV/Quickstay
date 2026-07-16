import { logger } from "../utils/logger"
import type { Request, Response } from "express";

const loggingMiddleware = (req: Request, res: Response, next: any) => {
    const time = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - time;
        logger.info(
            `${res.statusCode} for ${req.method} ${req.originalUrl} from IP: ${req.ip}`, 
            { data: 
                { 
                    ...( req.statusCode && req.statusCode == 500 &&
                        {
                            request: {
                                body: req.body,
                                query: req.query,
                                params: req.params
                            },
                            response: {
                                body: res.locals.responseBody || null
                            },
                        }
                    ),
                    duration: `${duration}ms`, 
                    method: req.method, 
                    url: req.originalUrl, 
                    ip: req.ip,
                    statusCode: res.statusCode 
                } 
            });
    });

    next();
}

export { loggingMiddleware };
