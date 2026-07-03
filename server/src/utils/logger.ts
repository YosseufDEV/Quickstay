import winston from "winston";
import { config } from "dotenv";
config();

const { combine, timestamp, printf, json } = winston.format;

const logLevel = process.env.LOG_LEVEL || "debug";

const logger = winston.createLogger({
    level: logLevel,
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({ filename: "logs/app.log" }),
    ]
})

if(process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: combine(
            timestamp(),
            printf(({ level, message, timestamp }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        )
    }));
}

export { logger };
