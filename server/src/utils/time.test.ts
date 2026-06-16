import { describe, it, expect } from "vitest";
import { turnIntoTimestamp } from "./time";

describe("Time stamp unit tests", () => {
    it("Should convert seconds to milliseconds", () => {
        expect(turnIntoTimestamp("12s")).toBe(12*1000)
    })

    it("Should convert minutes string to Milliseconds", () => {
        expect(turnIntoTimestamp("10m")).toBe(10*60*1000)
    })

    it("Should convert hours string to Milliseconds", () => {
        expect(turnIntoTimestamp("10h")).toBe(10*60*60*1000)
    })

    it("Should convert days string to Milliseconds", () => {
        expect(turnIntoTimestamp("10D")).toBe(10*24*60*60*1000)
    })

    it("Should convert years string to Milliseconds", () => {
        expect(turnIntoTimestamp("10D")).toBe(10*24*60*60*1000)
    })

    it("Should have the same value for different classifers", () => {
        expect(turnIntoTimestamp("24H")).toBe(turnIntoTimestamp("1D"));
    })

    it("Should have the same value for different fractional classifers", () => {
        expect(turnIntoTimestamp("36h")).toBe(turnIntoTimestamp("1.5D"));
    })

    it("Should work for fractional values", () => {
        expect(turnIntoTimestamp("1.5D")).toBe(1.5*24*60*60*1000);
    })

    it("Should convert to seconds", () => {
        expect(turnIntoTimestamp("1.7D", "s")).toBe(1.7*24*60*60);
    })

    it("Should throw error if invalid number is passed", () => {
        expect(() => turnIntoTimestamp("as")).toThrow();
    })

    it("Should throw error if invalid classifier is passed", () => {
        expect(() => turnIntoTimestamp("29o")).toThrow();
    })

    it("Should throw error if both values are invalid", () => {
        expect(() => turnIntoTimestamp("somethingsomethinginvalid")).toThrow();
    })

})
