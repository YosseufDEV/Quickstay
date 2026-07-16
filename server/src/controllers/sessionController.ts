import redis from "../db/redis.ts"
import { createHash } from "crypto";
import { turnIntoTimestamp } from "../utils/time.ts";
import { logger } from "@/utils/logger.ts";

type payload = {
    userId: string; 
    sessionId: string;
}

const JWT_REFRESH_EXPIRATION_TIME = turnIntoTimestamp(process.env.JWT_REFRESH_EXPIRATION_TIME || "30d")/1000; // Default to 30 days in milliseconds

const insertSession = async (token: string, payload: payload, exp: number=JWT_REFRESH_EXPIRATION_TIME) => {
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const usedToken = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);
    const usedTokenExpiry = await redis.ttl(`rt:${payload.userId}:${payload.sessionId}`);

    const { userId, sessionId } = payload;

    if(!userId || !sessionId || !token) {
        throw new Error("Invalid payload or token for session insertion");
    }

    if(usedToken) {
        await redis.set(`revoked:${payload.userId}:${payload.sessionId}:${usedToken}`, 1);
        await redis.expire(`revoked:${payload.userId}:${payload.sessionId}:${usedToken}`, usedTokenExpiry);
    }

    await redis.set(`rt:${payload.userId}:${payload.sessionId}`, hashedToken, { EX: Math.trunc(exp)});
}

const invalidateSession = async (payload: payload) => {
    const { userId, sessionId } = payload;
    try {
        await redis.set(`rt:${userId}:${sessionId}`, 1);
    } catch(error) {
        logger.debug("Error invalidating session in Redis: ", { error });
    }
}

const isSessionValid = async (token: string, payload: payload) => {
    const { userId, sessionId } = payload;

    try {
        const hashedToken = createHash("sha256").update(token).digest("hex");

        const storedToken = await redis.get(`rt:${userId}:${sessionId}`);
        const revokedToken = await redis.get(`revoked:${userId}:${sessionId}:${hashedToken}`);

        if(storedToken == "1") {
            return { valid: false, reason: "session_invalidated" };
        }

        if(revokedToken && revokedToken == "1") {
            await invalidateSession(payload).then(() => logger.info(`All sessions for user ${userId} invalidated due to token reuse`)).catch((error) => logger.debug('Error invalidating sessions in Redis: ', { error }));
            return { valid: false, reason: "token_reuse" };
        }

        if(!storedToken || storedToken !== hashedToken) {
            return { valid: false, reason: "token_not_found" };
        }

        return { valid: true };

    } catch(error) {
        logger.debug("Error validating session in Redis: ", { error });
        return { valid: false, reason: "redis_error" };
    }
}
        
export { insertSession, invalidateSession, isSessionValid };
