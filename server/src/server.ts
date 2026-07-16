import { app } from "./app.js";
import redis from "@/db/redis.js";
import drizzle from "@/db/drizzle.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5050;


await redis.connect().then(() => logger.info('Connected to Redis')).catch((error) => logger.error(`Redis connection error: ${error.message}`, { stack: error.stack }));
await drizzle.$client.connect().then(() => logger.info('Connected to PostgreSQL')).catch((error) => logger.error(`PostgreSQL connection error: ${error.message}`, { stack: error.stack }));

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

