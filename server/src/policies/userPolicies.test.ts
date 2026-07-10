import { describe, it, expect } from "vitest";
import { canGetAllUsers, canGetUser } from "./userPolicies";

describe("User Policies Tests", () => {
    it("Should return true if user is ADMIN", () => {
        const user = {
            role: "ADMIN",
        };
        expect(canGetAllUsers(user as any)).toBe(true);
    })

    it("Should return false if user is NOT ADMIN", () => {
        const user = {
            role: "USER",
        };
        expect(canGetAllUsers(user as any)).toBe(false);
    })

    it("Should return true if user is ADMIN or the same user", () => {
        const user = {
            role: "ADMIN",
            id: "test_id",
        };
        expect(canGetUser(user as any, "test_id")).toBe(true);
    });

    it("Should return false if user is NOT ADMIN and not the same user", () => {
        const user = {
            role: "USER",
            id: "test_id",
        };
        expect(canGetUser(user as any, "other_id")).toBe(false);
    });
})
