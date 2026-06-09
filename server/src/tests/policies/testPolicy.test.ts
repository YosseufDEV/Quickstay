import { test, expect } from "jest";
import { testPolicy } from "@/policies/testPolicy.ts";

test("testPolicy should return true for users with the 'admin' role", () => {
    const adminUser = { id: 1, name: "Admin User", role: "admin" };
    expect(testPolicy(adminUser)).toBe(true);
});
