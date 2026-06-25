import { beforeAll, describe, expect, it } from 'vitest';
import Booking from '@/src/models/Booking';
import Hotel from '@/src/models/Hotel';
import { User } from '@/src/models/User';

let hotel: Awaited<ReturnType<typeof Hotel.createHotel>>, user: Awaited<ReturnType<typeof User.createUser>>;

beforeAll(async () => {
    user = await User.createUser({
        firstName: 'Test User',
        lastName: 'Test User',
        email: 'testEmail',
        password: 'testPassword',
        country: 'Test Country',
    });

    hotel = await Hotel.createHotel({
        name: 'Test Hotel',
        address: 'Test Address',
        exactAddress: 'Test Exact Address',
        pricePerNight: 100,
        rating: 4.5,
        tags: [],
        imageUrl: 'testImage',
    })
});

let createdBooking: Awaited<ReturnType<typeof Booking.createBooking>>;

describe('Booking Model Test', () => {
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

