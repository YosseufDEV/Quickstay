import { describe, it, expect, beforeEach } from 'vitest';
import { createHash } from 'crypto';

import redis from '@/db/redis';
import { insertSession, invalidateSession, isSessionValid } from '@/controllers/sessionController';

describe('Session Controller Test', () => {
    const token = "testToken";
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const payload = {
        userId: "testUserId",
        sessionId: "testSessionId"
    };

    beforeEach(async () => {
        await redis.flushAll();
    });

    it("Should add user token", async () => {
        await insertSession(token, payload);

        const redisToken = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);

        expect(redisToken).toEqual(hashedToken);
    });

    it("Should rotate the token ", async () => {
        const newToken = "newTestToken";

        const newHashedToken = createHash("sha256").update(newToken).digest("hex");

        await insertSession(token, payload);
        await insertSession(newToken, payload);

        const redisToken = await redis.get(`revoked:${payload.userId}:${payload.sessionId}:${hashedToken}`);
        const newRedisToken = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);

        expect(redisToken).toEqual("1");
        expect(newRedisToken).toEqual(newHashedToken);
    })

    it("Should return that the user session is valid", async () => {
        await insertSession(token, payload);

        const validationResult = await isSessionValid(token, payload);
        expect(validationResult.valid).toBe(true);
    });

    it("Should set token auto TTL correctly", async () => {
        const exp = 30 * 24 * 60 * 60; // 30 days in seconds
        await insertSession(token, payload);

        const tokenExpiry = await redis.ttl(`rt:${payload.userId}:${payload.sessionId}`);
        expect(tokenExpiry).toBeLessThanOrEqual(exp);
        expect(tokenExpiry).toBeGreaterThan(0);
    });

    it("Should set token custom TTL correctly", async () => {
        await insertSession(token, payload, 42069);

        const tokenExpiry = await redis.ttl(`rt:${payload.userId}:${payload.sessionId}`);

        expect(tokenExpiry).toBeLessThanOrEqual(42069);
        expect(tokenExpiry).toBeGreaterThan(0);
    });

    it("Should set rotated token TTL correctly", async () => {
        await insertSession(token, payload, 42069);
        await insertSession("newToken", payload);

        const tokenExpiry = await redis.ttl(`revoked:${payload.userId}:${payload.sessionId}:${hashedToken}`);

        expect(tokenExpiry).toBeLessThanOrEqual(42069);
        expect(tokenExpiry).toBeGreaterThan(0);
    });

    it("Should return that the user session is invalid due to token reuse", async () => {
        await insertSession(token, payload);
        await insertSession("newTestToken", payload);

        const validationResult = await isSessionValid(token, payload);

        expect(validationResult.valid).toBe(false);
        expect(validationResult.reason).toBe("token_reuse");
    })

    it("Should return that the user session is invalid due to token not found", async () => {
        const validationResult = await isSessionValid(token, payload);

        expect(validationResult.valid).toBe(false);
        expect(validationResult.reason).toBe("token_not_found");
    });

    it("Should return that the user session is invalid due to token is not the active one", async () => {
        insertSession("othertestToken", payload);

        const validationResult = await isSessionValid(token, payload);

        expect(validationResult.valid).toBe(false);
        expect(validationResult.reason).toBe("token_not_found");
    });

    it("Should return session is invalid even if session", async () => {

        await insertSession(token, payload);

        await invalidateSession(payload);

        const sessionToken = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);

        const isValid = await isSessionValid(token, payload);

        expect(isValid.valid).toBe(false);
        expect(isValid.reason).toBe("session_invalidated");

        expect(sessionToken).toEqual("1");
    })
})
