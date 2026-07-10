import { beforeAll, describe, expect, it } from 'vitest';
import drizzle from "@/db/drizzle";
import { amenities, hotelsAmenities, hotelsCatalogs, rooms } from '@/db/schema';
import Hotel from '@/models/Hotel';
import { HotelError } from '@/errors/hotelErrors';
import { eq } from 'drizzle-orm';

describe("Hotel Model Test", () => {
    beforeAll(async () => {
        await drizzle.insert(amenities).values([
            { slug: "test-1" },
            { slug: "test-2" },
            { slug: "test-3" },
        ]).execute();
    })

    const hotelData = {
        name: "Test Hotel",
        rating: 4.5,
        address: "Test City",
        exactAddress: "123 Test Street",
        checkInTime: "18:00:00",
        checkOutTime: "14:00:00",
        imageUrl: "http://example.com/image.jpg",
        amenities: [{ id: 1 }, { id: 2 }],
        timeZone: "T",
        rooms: [
            {
                roomType: "Standard Room",
                roomNumber: 101,
            },
            {
                roomType: "Standard Room",
                roomNumber: 102,
            },
            {
                roomType: "Standard Room 2",
                roomNumber: 69,
            },
        ],
        catalog: [
            {
                roomType: "Standard Room",
                pricePerNight: 100,
                numberOfGuests: 2,
                area: 20,
                imageUrl: "http://example.com/room1.jpg",
            },
            {
                roomType: "Standard Room 2",
                pricePerNight: 192,
                numberOfGuests: 4,
                area: 39,
                imageUrl: "http://example.com/room2.jpg",
            }
        ]
    };

    let hotelId: string;

    it("Should create a hotel object with the correct properties", async () => {
        const hotel = await Hotel.createHotel(hotelData);

        hotelId = hotel.id;

        expect(hotel).toMatchObject(hotelData);
    });

    it("Should create a hotel catalog with the correct properties", async () => {
        const catalog = await drizzle.select().from(hotelsCatalogs).where(eq(hotelsCatalogs.hotelId, hotelId));

        expect(catalog.length).toBe(2);
        expect(catalog).toMatchObject(hotelData.catalog);
    })

    it("Should create hotel rooms with correct properties", async () => {
        const r = await drizzle.select().from(rooms).where(eq(rooms.hotelId, hotelId));

        expect(r.length).toBe(3);
        expect(r).toMatchObject(hotelData.rooms);
    });

    it("Should create hotel amenities with correct properties", async () => {
        const a = await drizzle.select().from(hotelsAmenities).where(eq(hotelsAmenities.hotelId, hotelId));

        expect(a.length).toBe(2);
        expect(a).toMatchObject(hotelData.amenities.map(a => ({ amenityId: a.id })));
    })

    it("Should throw an error because check in time is before check out time", async () => {

        const hd = structuredClone(hotelData);

        hd.checkInTime = "12:00:00";
        hd.checkOutTime = "14:00:00";

        await expect(async () => await Hotel.createHotel(hd)).rejects.toThrow(HotelError);
        await expect(async () => await Hotel.createHotel(hd)).rejects.toThrow("check_in_time_before_check_out_time");
    });

    it("Should get an hotel by id", async () => {
        const hotelFromDb = await Hotel.getHotelById(hotelId);

        expect(hotelFromDb).toMatchObject(hotelData);
    })
})
