import redis from "../db/redis.ts"

type payload = {
    userId: string; 
    sessionId: string;
}

const insertSession = async (token: string, payload: payload) => {
    if(!payload.userId || !payload.sessionId || !token) {
        console.error("Invalid payload or token for session insertion");
        return;
    }

    try {
        await redis.rPush(`refreshToken:${payload.userId}:${payload.sessionId}`, token);
    } catch(error) {
        console.error("Error inserting session into Redis: ", error);
    }
}

const invalidateAllSessions = async (userId: string) => {
    try {
        const keys = await redis.keys(`refreshToken:${userId}:*`);
        if(keys.length > 0) {
            await redis.del(keys);
        }
    } catch(error) {
        console.error("Error invalidating sessions in Redis: ", error);
    }
}

const invalidateSession = async (userId: string, sessionId: string) => {
    try {
        await redis.del(`refreshToken:${userId}:${sessionId}`);
    } catch(error) {
        console.error("Error invalidating session in Redis: ", error);
    }
}

const isSessionValid = async (userId: string, sessionId: string, token: string) => {
    try {
        const tokenFamily = await redis.lRange(`refreshToken:${userId}:${sessionId}`, 0, -1);

        console.log(tokenFamily);

        if(!tokenFamily.includes(token)) {
            return { valid: false, reason: "token_not_in_family" };
        }

        if(tokenFamily.at(-1) !== token) {
            await invalidateAllSessions(userId).then(() => console.log(`All sessions for user ${userId} invalidated due to token reuse`)).catch((error) => console.error('Error invalidating sessions in Redis: ', error));
            return { valid: false, reason: "token_reuse_detected" };
        }

        return { valid: true };
    } catch(error) {
        console.error("Error validating session in Redis: ", error);
        return { valid: false, reason: "redis_error" };
    }
}
        
export { insertSession, invalidateSession, invalidateAllSessions, isSessionValid };
