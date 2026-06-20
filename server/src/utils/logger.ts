import winston from "winston";

const { combine, timestamp, printf, json } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
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
