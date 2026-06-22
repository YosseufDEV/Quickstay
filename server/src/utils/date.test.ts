import { describe, it, expect } from 'vitest';
import { parseTSRangeToDates } from './date';

describe("Date Test", () => {
    it("Should create a date object and check its properties", () => {
        const from = new Date("2024-06-01T12:00:00Z");
        const to = new Date("2024-06-02T12:00:00Z");
        const parsed = parseTSRangeToDates(`[${from.toISOString()},${to.toISOString()}]`);

        expect(parsed.to).toEqual(to);
        expect(parsed.from).toEqual(from);
    })

    it("Should throw an error for invalid tsrange format", () => {
        expect(() => parseTSRangeToDates("{2024-06-01,2025-08-1}")).toThrow();
    })

    it("Should throw an error for invalid tsrange type", () => {
        expect(() => parseTSRangeToDates(123 as any)).toThrow();
    });
})
        
