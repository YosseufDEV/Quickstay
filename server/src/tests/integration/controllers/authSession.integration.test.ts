import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";

import { execSync } from "node:child_process";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

import redis from "@/src/db/redis";

import request from "supertest";

vi.stubEnv("JWT_REFRESH_EXPIRATION_TIME", "10m");

const app = (await import("@/src/app")).app;
const agent = request.agent(app);

const user = {
    email: "testUserEmail@email.domain",
    password: "testUserPassword123_"
};

let refreshToken: string, payload: { iat: number, userId: string, sessionId: string };

const extractToken = (cookies: string[]) => cookies.find((cookie) => cookie.startsWith("refreshToken="))?.split(";")[0]?.split("=")[1];

beforeAll(async () => {
    await agent.post("/api/v1/auth/register").send({ 
        email: user.email,
        password: user.password,
        firstName: "testFirstName",
        lastName: "testLastName",
        country: "testCountry",
    }).expect(201);

    const loginReq = await agent.post("/api/v1/auth/login").send(user).expect(200);

    // Ignore Error: Object is possibly 'undefined' TS error, we know the cookie will be set because the login was successful
    refreshToken = extractToken(loginReq.headers["set-cookie"] as unknown as string[])!;
    payload = jwt.decode(refreshToken) as typeof payload;
}, 100_000)

describe("Refresh function to Redis integration test", () => {
    it("Should insert the JWT Token into the cache with correct TTL", async () => {
        const hashedToken = createHash("sha256").update(refreshToken).digest("hex");

        const token = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);
        const tokenExpirarion = await redis.ttl(`rt:${payload.userId}:${payload.sessionId}`);

        expect(token).toBe(hashedToken);
        expect(tokenExpirarion).toBe(10*60); // 10 minutes in seconds
        // expect(tokenExpirarion).toBeGreaterThan(0); // Ensure the token has not expired yet

    })

    it("Should rotate the JWT Token and set the old one as revoked in the cache with correct TTL", async () => {
        const refreshReq = await agent.post("/api/v1/auth/refresh");

        expect(refreshReq.status).toBe(200);

        const newRefreshToken = extractToken(refreshReq.headers["set-cookie"] as unknown as string[] || []);

        const hashedOldToken = createHash("sha256").update(refreshToken).digest("hex");
        const hashedNewToken = createHash("sha256").update(newRefreshToken!).digest("hex");

        const newTokenInCache = await redis.get(`rt:${payload.userId}:${payload.sessionId}`);
        
        const newTokenTTL = await redis.ttl(`rt:${payload.userId}:${payload.sessionId}`);

        new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds to ensure some time has elapsed since the original token was issued

        const elapsedTime = Math.floor((Date.now()/1000 - payload.iat));
        const revokedOldTokenTTL = await redis.ttl(`revoked:${payload.userId}:${payload.sessionId}:${hashedOldToken}`);


        expect(refreshReq.status).toBe(200);
        expect(newTokenInCache).toBe(hashedNewToken);

        // The revoked old token TTL should be approximately 10 minutes minus the elapsed time since the original token was issued, with a small margin of error (5 seconds) to account for any delays in processing
        expect(revokedOldTokenTTL).toBeLessThanOrEqual(10*60-elapsedTime+5); 
        expect(revokedOldTokenTTL).toBeGreaterThanOrEqual(10*60-elapsedTime-5); 

        expect(newTokenTTL).toBeLessThanOrEqual(10*60+5); // 10 minutes in seconds
        expect(newTokenTTL).toBeGreaterThanOrEqual(10*60-5); // 10 minutes in seconds

    })
})


