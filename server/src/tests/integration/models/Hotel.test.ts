import { beforeAll, describe, expect, it } from 'vitest';
import drizzle from "@/db/drizzle";
import { amenities } from '@/db/schema';
import Hotel from '@/models/Hotel';

beforeAll(async () => {
    await drizzle.insert(amenities).values([
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
            amenities: [{ id: 1 }, { id: 2 }]
        };

        const hotel = await Hotel.createHotel(hotelData as any);

        hotelId = hotel.id;

        expect(hotel).toMatchObject(hotelData);
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
            amenities: [
                { id: 1, slag: "test-1" },
                { id: 2, slag: "test-2" }
            ]
        }));
    })

    it("Custom query should return hotels with the correct properties", async () => {
        const limit = 10;
        const offset = 2000;
        const hotels = await Hotel.getHotels(limit, offset);
        const hotelsSlow = await Hotel.getHotelsSlow(limit, offset);
        expect(hotels).toEqual(hotelsSlow);
    });
})
