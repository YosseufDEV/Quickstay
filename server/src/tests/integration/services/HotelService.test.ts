import { describe, it, expect, vi, beforeAll } from 'vitest';
import HotelService from '@/services/HotelService';
import Hotel from '@/models/Hotel';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Booking from '@/models/Booking';
import User from '@/models/User';
import drizzle from '@/db/drizzle';
import { hotelsBookings } from '@/db/schema';

const randomUUIDS = Array.from({ length: 4 }, () => crypto.randomUUID()!);
const hotelData = {
    id: randomUUIDS[0]!,
    name: "Test Hotel",
    rating: 4.5,
    address: "Test City",
    city: "Test City",
    country: "Test Country",
    checkInTime: "18:00:00",
    checkOutTime: "14:00:00",
    imageUrl: "http://example.com/image.jpg",
    timeZone: "T",
    rooms: [
        {
            id: randomUUIDS[0]!,
            typeId: randomUUIDS[0]!,
            number: 101,
        },
        {
            id: randomUUIDS[1]!,
            typeId: randomUUIDS[0]!,
            number: 102,
        },
        {
            id: randomUUIDS[2]!,
            typeId: randomUUIDS[1]!,
            number: 69,
        },
        {
            id: randomUUIDS[3]!,
            typeId: randomUUIDS[1]!,
            number: 72,
        },
    ],
    catalog: [
        {
            id: randomUUIDS[0]!,
            roomType: "Standard Room",
            pricePerNight: 100,
            numberOfGuests: 2,
            area: 20,
            imageUrl: "http://example.com/room1.jpg",
        },
        {
            id: randomUUIDS[1]!,
            roomType: "Standard Room 2",
            pricePerNight: 192,
            numberOfGuests: 4,
            area: 39,
            imageUrl: "http://example.com/room2.jpg",
        }
    ]
};

describe("HotelService Integration Tests", () => {
    beforeAll(async () => {
        await Hotel.createHotel(structuredClone(hotelData));

        await User.createUser({
            id: randomUUIDS[0]!,
            firstName: 'Test User',
            lastName: 'Test User',
            email: 'testEmail',
            password: 'testPassword',
            country: 'Test Country',
        });

        await User.createUser({
            id: randomUUIDS[1]!,
            firstName: 'Test User',
            lastName: 'Test User',
            email: 'testEmail2',
            password: 'testPassword',
            country: 'Test Country',

        })
        dayjs.extend(utc);
    })

    it("Should return all rooms as available if no booking exists", async () => {
        const hotelId = randomUUIDS[0]!;
        const availability = await HotelService.checkAvailability({ hotelId }, { checkin: new Date("2024-06-01"), checkout: new Date("2024-06-05") });

        console.log(availability);

        expect(availability).toMatchObject({
            hotelId: hotelId,
            availability: expect.arrayContaining([
                expect.objectContaining({
                    typeId: randomUUIDS[0]!,
                    isAvailable: true
                }),
                expect.objectContaining({
                    typeId: randomUUIDS[1]!,
                    isAvailable: true
                })
            ])
        })
    })

    it("Should check availability by hotelId and return all rooms as availabile", async () => {
        const hotelId = randomUUIDS[0]!;

        await Booking.createBooking({
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });
        const availability = await HotelService.checkAvailability({ hotelId }, { checkin: new Date("2024-06-01"), checkout: new Date("2024-06-05") });

        expect(availability).toMatchObject({
            hotelId: hotelId,
            availability: expect.arrayContaining([
                expect.objectContaining({
                    typeId: randomUUIDS[0]!,
                    isAvailable: true
                }),
                expect.objectContaining({
                    typeId: randomUUIDS[1]!,
                    isAvailable: true
                })
            ])
        })
    })

    it("Should check availability by hotelId and return only room typeId 2 as availabile", async () => {
        const hotelId = randomUUIDS[0]!;
        await drizzle.delete(hotelsBookings)

        const booking_1 = await Booking.createBooking({
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        const booking_2 = await Booking.createBooking({
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        const availability = await HotelService.checkAvailability({ hotelId }, { checkin: new Date("2024-06-01"), checkOut: new Date("2024-06-05") });

        expect(booking_1.details.roomId).not.toEqual(booking_2.details.roomId);

        expect(availability).toMatchObject({
            hotelId: hotelId,
            availability: expect.arrayContaining([
                expect.objectContaining({
                    typeId: randomUUIDS[0]!,
                    isAvailable: false
                }),
                expect.objectContaining({
                    typeId: randomUUIDS[1]!,
                    isAvailable: true
                })
            ])
        })
    })

    it("Should work if one room is available", async () => {
        const hotelId = randomUUIDS[0]!;

        await drizzle.delete(hotelsBookings)

        // INFO: Ignore errors;
        await drizzle.insert(hotelsBookings).values({
            roomId: randomUUIDS[0]!,
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            timeRange: {
                from: new Date("2024-05-29"),
                to: new Date("2024-06-02"),
            }
        });

        await drizzle.insert(hotelsBookings).values({
            roomId: randomUUIDS[0]!,
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            timeRange: {
                from: new Date("2024-06-02"),
                to: new Date("2024-06-05"),
            },
        });

        console.log(await drizzle.select().from(hotelsBookings));

        const availability = await HotelService.checkAvailability({ hotelId }, { checkin: new Date("2024-06-01"), checkout: new Date("2024-06-05") });

        expect(availability).toMatchObject({
            hotelId: hotelId,
            availability: expect.arrayContaining([
                expect.objectContaining({
                    typeId: randomUUIDS[0]!,
                    isAvailable: true
                })
            ])
        })
    })

    it("Should return all rooms as unavailable", async () => {
        const hotelId = randomUUIDS[0]!;
        
        await drizzle.delete(hotelsBookings)

        await Booking.createBooking({
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        await Booking.createBooking({
            roomTypeId: randomUUIDS[0]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[0]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2024-06-01"),
            to: new Date("2024-06-05"),
        });

        const availability = await HotelService.checkAvailability({ hotelId }, { checkin: new Date("2024-06-01"), checkout: new Date("2024-06-05") });

        expect(availability).toMatchObject({
            hotelId: hotelId,
            availability: expect.arrayContaining([
                expect.objectContaining({
                    typeId: randomUUIDS[0]!,
                    isAvailable: false
                }),
                expect.objectContaining({
                    typeId: randomUUIDS[1]!,
                    isAvailable: false
                })
            ])
        })
    });

    it("Should return all hotels", async () => {
        await drizzle.delete(hotelsBookings)

        const hotels = await HotelService.getHotels({ size: "10", page: "1" });

        const hotelDataC = structuredClone(hotelData);

        delete (hotelDataC as Partial<typeof hotelDataC> ).rooms;

        expect(hotels).toMatchObject({
            ...hotelDataC,
        })
    });

    it("Should filter hotels correctly by booking date", async () => {
        const hotelId = randomUUIDS[0]!;

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2026-08-25"),
            to: new Date("2026-09-29"),
        });

        const hotels = await HotelService.getHotels(
            { 
                size: "10", 
                page: "1", 
                checkin: new Date("2026-09-01"),
                checkout: new Date("2026-09-05"),
                guests: 4
            }
        );

        const hotelDataC = structuredClone(hotelData);

        delete (hotelDataC as Partial<typeof hotelDataC> ).rooms;

        expect(hotels).toMatchObject({
            ...hotelDataC,
        })

    })

    it("Should not return hotel if it does not have available rooms for the given date range", async () => {
        const hotelId = randomUUIDS[0]!;

        await drizzle.delete(hotelsBookings)

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2024-08-25"),
            to: new Date("2027-09-29"),
        });

        await Booking.createBooking({
            roomTypeId: randomUUIDS[1]!,
            hotelId: hotelId,
            userId: randomUUIDS[1]!,
            from: new Date("2025-08-31"),
            to: new Date("2027-09-06"),
        });

        const hotels = await HotelService.getHotels(
            { 
                size: "10", 
                page: "1", 
                checkin: new Date("2026-09-01"),
                checkout: new Date("2026-09-05"),
                guests: 4
            }
        );

        const hotelDataC = structuredClone(hotelData);

        delete (hotelDataC as Partial<typeof hotelDataC> ).rooms;

        expect(hotels).toEqual([])
    })
})
