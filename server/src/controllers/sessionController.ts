import redis from "../db/redis.ts"
import { createHash } from "crypto";
import { turnIntoTimestamp } from "../utils/time.ts";

type payload = {
    userId: string; 
    sessionId: string;
}

const JWT_REFRESH_EXPIRATION_TIME = turnIntoTimestamp(process.env.JWT_REFRESH_EXPIRATION_TIME || "30d")/1000; // Default to 30 days in milliseconds

const insertSession = async (token: string, payload: payload, exp: number=JWT_REFRESH_EXPIRATION_TIME) => {
    const hashedToken = createHash("sha256").update(token).digest("hex");

    if(!payload.userId || !payload.sessionId || !token) {
        console.error("Invalid payload or token for session insertion");
        return;
    }

    try {
        await redis.set(`rt:${payload.userId}:${payload.sessionId}:${hashedToken}`, payload.sessionId);
        await redis.expire(`rt:${payload.userId}:${payload.sessionId}:${hashedToken}`, Math.trunc(exp), "NX"); 
    } catch(error) {
        console.error("Error inserting session into Redis: ", error);
    }
}

const rotateToken = async (token: string, payload: payload) => {
    const { userId, sessionId } = payload;
    try {
        const hashedToken = createHash("sha256").update(token).digest("hex");
        await redis.set(`rt:${userId}:${sessionId}:${hashedToken}`, `used ${sessionId}`);
        await redis.expire(`rt:${userId}:${sessionId}:${hashedToken}`, 60*30); 
    } catch(error) {
        console.error("Error rotating token in Redis: ", error);
    }
}

const invalidateAllSessions = async (userId: string) => {
    try {
        const { keys } = await redis.scan(`rt:${userId}:*`);

        if(keys.length > 0) {
            await redis.del(keys);
        }
    } catch(error) {
        console.error("Error invalidating sessions in Redis: ", error);
    }
}

const invalidateSession = async (payload: payload) => {
    const { userId, sessionId } = payload;
    try {
        const { keys } = await redis.scan(`rt:${userId}:${sessionId}:*`);
        await redis.del(keys);
    } catch(error) {
        console.error("Error invalidating session in Redis: ", error);
    }
}

const isSessionValid = async (token: string, payload: payload) => {
    const { userId, sessionId} = payload;
    try {
        const hashedToken = createHash("sha256").update(token).digest("hex");

        const storedToken = await redis.get(`rt:${userId}:${sessionId}:${hashedToken}`);

        if(!storedToken) {
            return { valid: false, reason: "token_not_found" };
        }

        if(storedToken.startsWith("used")) {
            await invalidateAllSessions(userId).then(() => console.log(`All sessions for user ${userId} invalidated due to token reuse`)).catch((error) => console.error('Error invalidating sessions in Redis: ', error));
            return { valid: false, reason: "token_reuse" };
        }

        return { valid: true };
    } catch(error) {
        console.error("Error validating session in Redis: ", error);
        return { valid: false, reason: "redis_error" };
    }
}
        
export { insertSession, invalidateSession, invalidateAllSessions, isSessionValid, rotateToken };
