import redis from "@/db/redis";
import { logger } from "@/utils/logger";

class CachingService {
    static async setCache(key: string, value: any, expirationInSeconds: number) {
        const stringValue = JSON.stringify(value);
        await redis.set(key, stringValue, { EX: expirationInSeconds });
    }

    static async getCache(key: string) {
        const cachedValue = await redis.get(key);
        if (cachedValue) {
            logger.info(`Cache hit for key: ${key}`);
            return JSON.parse(cachedValue);
        }
        logger.info(`Cache miss for key: ${key}`);
        return null;
    }
}

export default CachingService;
