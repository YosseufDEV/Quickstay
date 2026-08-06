import api from "./client"

interface BookingData {
    roomTypeId: string
    hotelId: string
    checkIn: Date,
    checkOut: Date
}

export interface BookingResponse {
    booking: {
        details: {
            id: string
            userId: string
            roomId: string
            timeRange: {
                from: Date,
                to: Date
            }
            bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED"
            checkInStatus: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT"
            hotel: {
                id: string
                name: string
                address: string
                rating: number
                checkInTime: string
                checkOutTime: string
            }
        },
        invoice: {
            id: string
            hotelId: string,
            bookingId: string
            roomType: string,
            pricePerNight: number
            numberOfNights: number
            basePrice: number
            fees: { type: string, amount: number }[]
            totalPrice: number
        }
        paymentIntentClientSecret: string
    }
}

interface AvailabilityResponse {
    availability: {
        hotelId: string
        catalogAvailability: {
            typeId: string
            isAvailalbe: boolean
        }[]
    }
}

const createBooking = async (bookingData: BookingData, idempotencyKey: string): Promise<BookingResponse> => {
   console.log(idempotencyKey);
   const { data, request } = await api.post("/bookings", bookingData, { headers: { "Idempotency-Key": idempotencyKey } });
   console.log(request);
   return data.payload;
}

const getUserBookings = async (userId: string): Promise<BookingResponse[]> => {
    const { data } = await api.get(`/${userId}/bookings`);
    return data.payload.bookings;
}

const checkAvailability = async (hotelId: string, checkIn: Date, checkOut: Date): Promise<AvailabilityResponse> => {
    const { data } = await api.post(`/hotels/${hotelId}/availability`, { checkIn, checkOut });
    return data.payload;
}

export { createBooking, checkAvailability }
