import { describe, it, expect } from 'vitest';
import * as Generate from './generate';

describe('Seed Test', () => {
    it("should generate 20 rooms", () => {
        const rooms = Generate.generateRooms("1", 20);
        console.log(rooms);
        expect(rooms.length).toBe(20);
    })
})
