import api from "./client"

interface BookingData {
    roomType: string
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
            hotel: {
                id: string
                name: string
                address: string
                rating: number
                checkInTime: string
                checkOutTime: string
            }
            totalPrice: number
        }
        paymentIntentClientSecret: string
    }
}


const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
   const { data } = await api.post("/bookings", bookingData);
   return data.payload;
}

export { createBooking }
