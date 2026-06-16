import { describe, vi, expect, it } from "vitest";

import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "@/src/app";
import { checkAuthentication } from "@/src/middleware/authenticationMiddleware";


const test_secret = "test_secret";
const protectedMessage = "You have access to this protected route";

vi.stubEnv("JWT_ACCESS_SECRET", test_secret);

app.get("/protected", checkAuthentication, (_, res) => res.status(200).json({ message: protectedMessage }));

describe("Authentication Middleware Tests", () => {
    it("Should not return an error and call the next function", async () => {
        const validJWTToken = jwt.sign({ user: "test_id" }, test_secret);

        const res = await request(app).get("/protected").set("Authorization", `Bearer ${validJWTToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: protectedMessage });
    })

    it("Should return 401 and no token provided message if no token is provided", async () => {
        const res = await request(app).get("/protected");

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: "token_not_provided" });
    })

    it("Should return 401 and expired message if token is expired", async () => {
        const expiredJWTToken = jwt.sign({ user: "test_id" }, test_secret, { expiresIn: "-1s" });
        const res = await request(app).get("/protected").set("Authorization", `Bearer ${expiredJWTToken}`);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: "token_expired" });
    })

    it("Should return 401 and invalid message if token is invalid", async () => {
        const expiredJWTToken = jwt.sign({ user: "test_id" }, "bad_secret", { expiresIn: "-1s" });

        const res = await request(app).get("/protected").set("Authorization", `Bearer ${expiredJWTToken}`);

        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: "token_invalid" });

        const res2 = await request(app).get("/protected").set("Authorization", `Bearer malformed_token`);

        expect(res2.status).toEqual(401);
        expect(res2.body).toEqual({ message: "token_invalid" });
    })
})
