import { beforeAll, describe, expect, it } from 'vitest';
import Booking from '@/models/Booking';
import Hotel from '@/models/Hotel';
import User from '@/models/User';
import { BookingError } from '@/errors/bookingErrors';

let hotel: Awaited<ReturnType<typeof Hotel.createHotel>>, user: Awaited<ReturnType<typeof User.createUser>>;

const fromDate = new Date(Date.UTC(2023, 0, 1)); 
const toDate = new Date(Date.UTC(2023, 0, 5));

let createdBooking: Awaited<ReturnType<typeof Booking.createBooking>>;

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
            type: "Standard Room",
            number: 101,
        },
        {
            type: "Standard Room",
            number: 102,
        },
        {
            type: "Standard Room 2",
            number: 69,
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
        const booking = await Booking.book({
            roomType: "Standard Room",
            hotelId: hotel.id,
            userId: user.id,
            from: fromDate,
            to: toDate,
        })

        createdBooking = booking;

        expect(booking).toMatchObject({
            userId: user.id,
            timeRange: {
                from: fromDate,
                to: toDate,
            }
        });

        expect(hotel.rooms!.some(room => room.id === booking.roomId && room.type == "Standard Room")).toBe(true);

    });

    it('should allow booking the same room in non-overlapping timeranges', async () => {
        const from = new Date(Date.UTC(2023, 0, 6));
        const to = new Date(Date.UTC(2023, 0, 10));

        const booking = await Booking.book({
            roomType: "Standard Room",
            hotelId: hotel.id,
            userId: user.id,
            from,
            to
        })

        expect(booking).toMatchObject({
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
            await Booking.book({
                roomType: hotel.catalog![0]?.roomType!,
                userId: user.id,
                hotelId: hotel.id,
                from: fromDate,
                to: toDate,
            })
        }).rejects.toThrow(BookingError);

        await expect(async () => {
            await Booking.book({
                roomType: "Standard Room",
                hotelId: hotel.id,
                userId: user.id,
                from: fromDate,
                to: toDate,
            })
        }).rejects.toThrow("no_available_room");
    });

    it("Should get booking by id", async () => {
        const booking = await Booking.getBookingById(createdBooking.id);

        expect(booking).toMatchObject({
            userId: user.id,
            timeRange: {
                from: fromDate,
                to: toDate,
            },
            user
        });
    })
})

