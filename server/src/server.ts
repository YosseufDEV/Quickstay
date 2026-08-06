import { app } from "./app";
import redis from "@/db/redis";
import drizzle from "@/db/drizzle";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5050;

await redis.connect().then(() => logger.info('Connected to Redis'))
await drizzle.$client.connect().then(() => logger.info('Connected to PostgreSQL')).catch((error) => logger.error(`PostgreSQL connection error: ${error.message}`, { stack: error.stack }));

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

