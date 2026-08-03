import { beforeAll, describe, expect, it } from 'vitest';
import Booking from '@/models/Booking';
import Hotel from '@/models/Hotel';
import User from '@/models/User';
import { BookingError } from '@/errors/bookingErrors';
import drizzle from '@/db/drizzle';
import { hotelsBookings, hotelsBookingsPayments } from '@/db/schema';

let hotel: Awaited<ReturnType<typeof Hotel.createHotel>>, user: Awaited<ReturnType<typeof User.createUser>>;

const fromDate = new Date(Date.UTC(2023, 0, 1)); 
const toDate = new Date(Date.UTC(2023, 0, 5));

let createdBooking: Awaited<ReturnType<typeof Booking.createBooking>>;

const randomUUIDS = Array.from({ length: 2 }, () => crypto.randomUUID()!);
const hotelData = {
    name: "Test Hotel",
    rating: 4.5,
    address: "Test City",
    exactAddress: "123 Test Street",
    checkInTime: "18:00:00",
    checkOutTime: "14:00:00",
    imageUrl: "http://example.com/image.jpg",
    timeZone: "T",
    rooms: [
        {
            typeId: randomUUIDS[0]!,
            number: 101,
        },
        {
            typeId: randomUUIDS[0]!,
            number: 102,
        },
        {
            typeId: randomUUIDS[1]!,
            number: 69,
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

describe('Booking Model Test', () => {
    beforeAll(async () => {
        user = await User.createUser({
            firstName: 'Test User',
            lastName: 'Test User',
            email: 'testEmail',
            password: 'testPassword',
            country: 'Test Country',
        });

        hotel = await Hotel.createHotel(structuredClone(hotelData))

        console.log(hotel);
    });

    it('should create a booking', async () => {
        const booking = await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from: fromDate,
            to: toDate,
        })

        createdBooking = booking;

        expect(booking.details).toMatchObject({
            userId: user.id,
            timeRange: {
                from: fromDate,
                to: toDate,
            }
        });

        expect(hotel.rooms!.some(room => room.id === booking.details.roomId)).toBe(true);

    });

    it('should allow booking the same room in non-overlapping timeranges', async () => {
        const from = new Date(Date.UTC(2023, 0, 6));
        const to = new Date(Date.UTC(2023, 0, 10));

        const booking = await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from,
            to
        })

        expect(booking.details).toMatchObject({
            userId: user.id,
            timeRange: {
                from,
                to,
            }
        });
    });

    it("Should not allow booking the same room in overlapping timeranges", async () => {
        const fromDate = new Date(Date.UTC(2023, 0, 4)); 
        const toDate = new Date(Date.UTC(2023, 0, 8));

        await expect(async () => {
            await Booking.createBooking({
                roomTypeId: hotel.catalog![0]?.id!,
                hotelId: hotel.id,
                userId: user.id,
                from: fromDate,
                to: toDate,
            })
        }).rejects.toThrow("no_available_room");
    });

    it("Should get booking by id", async () => {
        const booking = await Booking.getBookingById(createdBooking.details.id);

        delete (user as Partial<typeof user>).password;

        expect(booking).toMatchObject({
            userId: user.id,
            timeRange: {
                from: fromDate,
                to: toDate,
            },
            user: {
                ...user,
            }
        });
    })

    it("Should confirm booking", async () => {
        await Booking.confirmBooking(createdBooking.details.id);

        const booking = await Booking.getBookingById(createdBooking.details.id);

        expect(booking).toMatchObject({
            bookingStatus: "CONFIRMED"
        })
    })

    it("Should pick the least booked room for the same room type", async () => {
        const from = new Date(Date.UTC(2023, 0, 6));
        const to = new Date(Date.UTC(2023, 0, 10));

        const from2 = new Date(Date.UTC(2023, 0, 11));
        const to2 = new Date(Date.UTC(2023, 0, 15));

        await drizzle.delete(hotelsBookings);

        await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from,
            to
        })

        await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from,
            to
        })

        await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from: from2,
            to: to2
        })

        await Booking.createBooking({
            roomTypeId: hotel.catalog![0]?.id!,
            hotelId: hotel.id,
            userId: user.id,
            from: from2,
            to: to2
        })

        const bookings = await Booking.getAllBookings();

        const result = bookings.reduce((acc, booking) => {
            acc[booking.roomId] = (acc[booking.roomId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        expect(result).toMatchObject({
            [hotel.rooms![0]?.id!]: 2,
            [hotel.rooms![1]?.id!]: 2,
        })
    })

})

