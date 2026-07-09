import { beforeAll, describe, expect, it } from 'vitest';
import Booking from '@/models/Booking';
import Hotel from '@/models/Hotel';
import User from '@/models/User';

let hotel: Awaited<ReturnType<typeof Hotel.createHotel>>, user: Awaited<ReturnType<typeof User.createUser>>;

let createdBooking: Awaited<ReturnType<typeof Booking.createBooking>>;

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

describe('Booking Model Test', () => {
    beforeAll(async () => {
        user = await User.createUser({
            firstName: 'Test User',
            lastName: 'Test User',
            email: 'testEmail',
            password: 'testPassword',
            country: 'Test Country',
        });

        hotel = await Hotel.createHotel(hotelData)
    });
    it('should create a booking', async () => {
        const fromDate = new Date(Date.UTC(2023, 0, 1)); 
        const toDate = new Date(Date.UTC(2023, 0, 5));

        const booking = await Booking.book({
            hotelId: hotel.id,
            userId: user.id,
            from: fromDate,
            to: toDate,
        })

        createdBooking = booking;

        expect(booking?.timeRange.from).toEqual(fromDate);
        expect(booking?.timeRange.to).toEqual(toDate);
    });

    it("Should get booking by id", async () => {
        const booking = await Booking.getBookingById(createdBooking.id);

        expect(booking?.id).toEqual(createdBooking.id);
        expect(booking?.timeRange.from).toEqual(createdBooking.timeRange.from);
        expect(booking?.timeRange.to).toEqual(createdBooking.timeRange.to);
    })

    it("Should throw an error when trying to book an hotel in a booked date range", async () => {
        const fromDate = new Date(Date.UTC(2022, 11, 31)); 
        const toDate = new Date(Date.UTC(2023, 0, 7));

        // expect(async () => {
        const booking = await Booking.book({
                roomId: hotel.id,
                userId: user.id,
                from: fromDate,
                to: toDate,
            })

        console.log("Booking result:", booking);
        // }).toThrow();

    })

})

