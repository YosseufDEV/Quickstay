import { useState } from "react";
import dayjs from "dayjs";
import BackwardArrow from "@/Components/BackwardArrow/BackwardArrow";
import InvoiceCard from "./Components/InvoiceCard";
import { useEffect, useId } from "react";
import * as Payment from "./Components/PaymentForm";
import { useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createBooking as apiCreateBooking } from "@/api/booking";
import LoadingOverlay from "@/Components/LoadingOverlay/LoadingOverlay";
import BookingProvider from "@/providers/BookingProvider";
import { ClockArrowDown, ClockArrowUp } from "lucide-react";
import IconText from "@/Components/IconText/IconText";
import SkeletonBookingView from "./SkeletonBookingView";

const BookingView = () => {
    const { hotelId, roomTypeId, from, to, idempotencyKey } = useLocation()?.state || {};

    console.log("idempotencyKey", idempotencyKey);
    const [processing, setProcessing] = useState(false);
    const [paymentLoaded, setPaymentLoaded] = useState(false);

    const formId = useId();

    const { data: booking, mutate: createBooking, isSuccess } = useMutation({
        mutationFn: async () => {
            const { booking }  = await apiCreateBooking({
                hotelId: hotelId,
                roomTypeId,
                checkIn:from,
                checkOut: to
            }, idempotencyKey);

            return booking;
        },
        onError: (error) => {
            console.error(error);
        }
    })

    useEffect(() => {
        createBooking();
    }, []);

    if(isSuccess && booking) {
        return (
            <BookingProvider booking={booking} formId={formId} setProcessing={setProcessing}>
                <LoadingOverlay isVisible={processing} />
                <div className="grid grid-cols-[2fr_1fr] min-h-screen w-screen font-[Inter]">
                    <div className="p-10 flex flex-col gap-5">
                        <BackwardArrow />
                        <p className="font-bold text-2xl">Book {booking.details.hotel.name}</p>
                        <div>
                            <label htmlFor={formId} className="text-xl font-semibold">Step 3: Payment</label>
                            <div className="w-full h-full mt-5">
                                <Payment.PaymentContainer clientSecret={booking.paymentIntentClientSecret} />
                            </div>
                        </div>
                        <hr className="my-4"/>
                        <div className="flex justify-start flex-col gap-10 w-full">
                            <p className="text-xl font-semibold">House rules</p>
                            <div className="flex gap-25">
                                <div className="flex flex-col gap-3 items-start">
                                    <IconText fontSize={16} textClassName="text-gray-800 font-medium" Icon={ClockArrowDown} text="Check-in Time" />
                                    <p>From { dayjs(`2026-07-23 ${booking.details.hotel.checkInTime}`).format(`h:mm A`) }</p>
                                </div>
                                <div className="flex flex-col gap-3 items-start">
                                    <IconText fontSize={16} textClassName="text-gray-800 font-medium" Icon={ClockArrowUp} text="Check-out Time" />
                                    <p>Until { dayjs(`2026-07-23 ${booking.details.hotel.checkOutTime}`).format("h:mm A")  }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 flex justify-start flex-col gap-10">
                        <InvoiceCard details={booking.details} invoice={booking.invoice}  />
                        <Payment.PaymentButton formId={formId} />
                    </div>
                </div> 
            </BookingProvider>
        );
    }

    return <SkeletonBookingView />
}

export default BookingView;
