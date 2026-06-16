import { describe, it, expect } from "vitest";
import { canGetAllUsers, canGetUser } from "./userPolicies";

describe("User Policies Tests", () => {
    it("Should return true if user is admin", () => {
        const user = {
            role: "admin",
        };
        expect(canGetAllUsers(user as any)).toBe(true);
    })

    it("Should return false if user is NOT admin", () => {
        const user = {
            role: "user",
        };
        expect(canGetAllUsers(user as any)).toBe(false);
    })

    it("Should return true if user is admin or the same user", () => {
        const user = {
            role: "admin",
            id: "test_id",
        };
        expect(canGetUser(user as any, "test_id")).toBe(true);
    });

    it("Should return false if user is NOT admin and not the same user", () => {
        const user = {
            role: "user",
            id: "test_id",
        };
        expect(canGetUser(user as any, "other_id")).toBe(false);
    });
})
