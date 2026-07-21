import { createContext } from "react";
import BackwardArrow from "@/Components/BackwardArrow/BackwardArrow";
import ReceiptCard from "./Components/ReceiptCard";
import { useEffect, useId, useState } from "react";
import * as Payment from "./Components/PaymentForm";
import { useLocation } from "react-router";
import useAuthStore from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { createBooking as apiCreateBooking, type BookingResponse } from "@/api/booking";

export const BookingContext = createContext({ booking: null as BookingResponse | null, formId: null as string | null });

const BookingView = () => {
    const { hotelId, roomType, from, to } = useLocation().state;
    console.log("BookingView state:", { hotelId, roomType, from, to });
    const [ createdBooking, setCreatedBooking ] = useState(null);

    const receipt = {
        room: { 
            id: "1",
            imageUrl: "http://localhost:5001/rooms/4.webp",
            type: "Deluxe Room",
            number: 101,
            price: 69 
        },
        booking: {
            checkInDate: "2024-06-01",
            checkOutDate: "2024-08-05"
        },
        hotel: {
            id: "1",
            name: "Grand Hotel"
        }
    }

    const formId = useId();

    const { mutate: createBooking } = useMutation({
        mutationFn: async () => {
            const booking = await apiCreateBooking({
                userId: useAuthStore.getState().user.id,
                hotelId: hotelId,
                roomType: roomType,
                checkIn:from,
                checkOut: to
            });

            setCreatedBooking(booking.booking);

            console.log("Booking created:", booking.booking);
            return booking.booking;
            f
        },
        onSuccess: (data) => {
            console.log("Booking created successfully:", data);
        },
        onError: (error) => {
            console.error(error);
        }
    })

    useEffect(() => {
        createBooking();
    }, []);

    if(createdBooking) {
        return (
        <BookingContext.Provider value={{ booking: createdBooking, formId }}>
            <div className="grid grid-cols-[2fr_1fr] min-h-screen w-screen">
                <div className="p-10 flex flex-col gap-5">
                    <BackwardArrow />
                    <p className="font-bold text-xl">Book {receipt.hotel.name}</p>
                    <div className="w-full h-full">
                        <Payment.PaymentContainer clientSecret={createdBooking.paymentIntentClientSecret} formId={formId} />
                    </div>
                </div>
                <div className="p-10 flex justify-start flex-col gap-10">
                    { createdBooking && <ReceiptCard booking={createdBooking.booking} receipt={createdBooking.receipt} paymentIntentClientSecret={createdBooking.paymentIntentClientSecret} /> }
                    <Payment.PaymentButton formId={formId} />
                </div>
            </div> 
        </BookingContext.Provider>
        );
    }
}

export default BookingView;
