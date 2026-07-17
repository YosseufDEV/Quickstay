import api from "./client"

interface BookingData {
    userId: string
    roomType: string
    hotelId: string
    checkIn: Date,
    checkOut: Date
}

export interface BookingResponse {
    booking: {
        id: string
        userId: string
        roomId: string
        timeRange: {
            from: Date,
            to: Date
        }
        bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED"
        checkInStatus: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT"
    },
    receipt: {
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


const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
   const { data } = await api.post("/bookings", bookingData);
   return data.payload;
}

export { createBooking }
