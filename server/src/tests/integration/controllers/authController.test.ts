import { describe, it,  expect, beforeEach } from "vitest";

import { app } from "@/app.ts";
import redis from "@/db/redis";

import request from "supertest";

const user = {
    email: "nameyinx@gmail.com",
    password: "Passwor2d_",
    firstName: "nameyinx",
    lastName: "test",
    country: "test",
};

const extractRefreshTokenFromCookies = (cookies: string[] | undefined): string | null => {
    if (!cookies) return null;

    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith("refreshToken="));

    return refreshTokenCookie ? refreshTokenCookie : null;
}

describe("Auth Controller Login & Register Integration Tests", () => {
    beforeEach(async () => {
        await redis.flushAll();
    })

    it("Should register user ", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(user);
        expect(res.status).toBe(201);
    })

    it("Should throw error if email already exists", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(user);
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("email_already_in_use");
    })

    it("Should login user", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ email: user.email, password: user.password });

        const cookies: string[] = res.headers["set-cookie"] as unknown as string[] || [];

        const hasRefreshTokenCookie = cookies.some((cookie: string) => cookie.startsWith("refreshToken="));

        expect(res.status).toBe(200);
        expect(res.body.payload.accessToken).toBeDefined();
        expect(hasRefreshTokenCookie).toBe(true);
    });

    it("should not login user with wrong credentials", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ email: user.email, password: "wrong_password" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("invalid_credentials");
    });

     it("should not login user that does not exist", async () => {
        const res = await request(app).post("/api/v1/auth/login").send({ email: "doesntexist@doesntexist.exist", password: "wrong_password" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("invalid_credentials");
     });


})

describe("Auth Controller Authentication & Token-state Integration Tests", () => {
    it("should logout user and invalidate session", async () => {
        const agent = request.agent(app);

        // To get the refresh token cookie, we need to use the same agent for both login and logout requests
        const loginRes = await agent.post("/api/v1/auth/login").send({ email: user.email, password: user.password });
        
        const logoutRes = await agent.post("/api/v1/auth/logout").set("Authorization", `Bearer ${loginRes.body.payload.accessToken}`);

        expect(logoutRes.status).toBe(200);
    })

    it("should return 401 if user is not authenticated", async () => {
        const res = await request(app).post("/api/v1/auth/logout");
        expect(res.status).toBe(401);
    });

    it("should refresh access token and exchange", async () => {
        const agent = request.agent(app);

        await agent.post("/api/v1/auth/login").send({ email: user.email, password: user.password });

        const refreshRes = await agent.post("/api/v1/auth/refresh");

        expect(refreshRes.status).toBe(200);
        expect(refreshRes.body.payload.accessToken).toBeDefined();

    })

    it("should return 400 if refresh token is not not provided", async () => {
        const refreshRes = await request(app).post("/api/v1/auth/refresh");

        expect(refreshRes.status).toBe(400);
        expect(refreshRes.body.message).toBe("no_token_provided");
    })

    it("should return 401 if refresh token is invalid", async () => {
        const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", ["refreshToken=invalid_token"]);

        expect(refreshRes.status).toBe(400);
        expect(refreshRes.body.message).toBe("token_invalid");
    })

    it("should return 400 if refresh token is reused", async () => {
        const agent = request.agent(app);

        const loginReq = await agent.post("/api/v1/auth/login").send({ email: user.email, password: user.password });

        const refreshCookie = extractRefreshTokenFromCookies(loginReq.headers["set-cookie"] as unknown as string[]);

        await agent.post("/api/v1/auth/refresh");

        const refreshRes = await request(app).post("/api/v1/auth/refresh").set("Cookie", refreshCookie!.split(";")[0] as string);

        expect(refreshRes.status).toBe(400);
        expect(refreshRes.body.message).toBe("token_reuse");
    })

})
