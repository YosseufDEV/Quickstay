import { describe, it,  expect } from "vitest";

import { app } from "@/src/app.ts";

import request from "supertest";

describe("Auth Controller Integration Tests", () => {
    const user = {
        email: "nameyinx@gmail.com",
        password: "Passwor2d_",
        firstName: "nameyinx",
        lastName: "test",
        country: "test",
    };

    it("Should register user ", async () => {
        const res = await request(app).post("/auth/register").send(user);
        expect(res.status).toBe(201);
    })

    it("Should throw error if email already exists", async () => {
        const res = await request(app).post("/auth/register").send(user);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("email_already_in_use");
    })

})
