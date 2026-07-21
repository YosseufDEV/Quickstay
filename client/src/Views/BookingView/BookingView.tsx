import { createContext } from "react";
import BackwardArrow from "@/Components/BackwardArrow/BackwardArrow";
import ReceiptCard from "./Components/ReceiptCard";
import { useEffect, useId } from "react";
import * as Payment from "./Components/PaymentForm";
import { useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createBooking as apiCreateBooking, type BookingResponse } from "@/api/booking";

export const BookingContext = createContext({ booking: null as BookingResponse["booking"] | null, formId: null as string | null });

const BookingView = () => {
    const { hotelId, roomType, from, to } = useLocation()?.state || {};

    const formId = useId();

    const { data: booking, mutate: createBooking, isSuccess } = useMutation({
        mutationFn: async () => {
            const { booking }  = await apiCreateBooking({
                hotelId: hotelId,
                roomType: roomType,
                checkIn:from,
                checkOut: to
            });

            return booking;
        },
        onError: (error) => {
            console.error(error);
        }
    })

    console.log("Booking data:", booking);

    useEffect(() => {
        console.log("Booking created successfully:", booking);
        createBooking();
    }, [createBooking]);

    if(isSuccess && booking) {
        return (
            <BookingContext.Provider value={{ booking, formId }}>
                <div className="grid grid-cols-[2fr_1fr] min-h-screen w-screen font-[Inter]">
                    <div className="p-10 flex flex-col gap-5">
                        <BackwardArrow />
                        <p className="font-bold text-2xl">Book {booking.receipt.hotel.name}</p>
                        <label htmlFor={formId} className="text-xl font-semibold">Step 3: Payment</label>
                        <div className="w-full h-full">
                            <Payment.PaymentContainer clientSecret={booking.paymentIntentClientSecret} />
                        </div>
                    </div>
                    <div className="p-10 flex justify-start flex-col gap-10">
                        <ReceiptCard details={booking.details} receipt={booking.receipt}  />
                        <Payment.PaymentButton formId={formId} />
                    </div>
                </div> 
            </BookingContext.Provider>
        );
    }
}

export default BookingView;
