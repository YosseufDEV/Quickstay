import { beforeAll, describe, expect, it } from 'vitest';
import drizzle from "@/src/db/drizzle";
import { tags } from '@/src/db/schema';
import Hotel from '@/src/models/Hotel';

beforeAll(async () => {
    await drizzle.insert(tags).values([
        { slag: "test-1" },
        { slag: "test-2" },
        { slag: "test-3" },
    ]).execute();
})

describe("Hotel Model Test", () => {
    let hotelId: string;

    it("Should create a hotel object with the correct properties", async () => {
        const hotelData = {
            name: "Test Hotel",
            pricePerNight: 100,
            rating: 4.5,
            address: "Test City",
            exactAddress: "123 Test Street",
            imageUrl: "http://example.com/image.jpg",
            tags: [{ id: 1, slag: "test-1", }, { id: 2, slag: "test-2" }]
        };

        const hotel = await Hotel.createHotel(hotelData as any);

        hotelId = hotel.id;
        expect(hotel.id).toBeDefined();
        expect(hotel).toEqual(expect.objectContaining(hotelData));
    });

    it("Should get an hotel by id", async () => {
        const hotelFromDb = await Hotel.getHotelById(hotelId);

        expect(hotelFromDb).toEqual(expect.objectContaining({
            id: hotelId,
            name: "Test Hotel",
            pricePerNight: 100,
            rating: 4.5,
            address: "Test City",
            exactAddress: "123 Test Street",
            imageUrl: "http://example.com/image.jpg",
            tags: [
                { id: 1, slag: "test-1" },
                { id: 2, slag: "test-2" }
            ]
        }));
    })
})
