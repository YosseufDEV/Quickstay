import { useEffect } from "react";

import { parse } from "date-fns";
import { CalendarArrowDown, CalendarArrowUp, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import InvoiceCard from "./Components/InvoiceCard";
import IconText from "@/Components/IconText/IconText";
import type { BookingResponse } from "@/api/booking";

const SuccessBookingView = () => { 
    const { booking, idempotencyKey } = useLocation()?.state as { booking: BookingResponse["booking"], fromRedirect?: true } ?? { booking: null, fromRedirect: false };
    const navigate = useNavigate();

    const checkInDate = new Date(booking?.details.timeRange.from);
    const checkOutDate = new Date(booking?.details.timeRange.to);

    const dateOpts: Intl.DateTimeFormatOptions = { weekday: "long", month: 'long', day: '2-digit', year: 'numeric' };

    const formattedCheckInDate = Intl.DateTimeFormat('en-US', dateOpts).format(checkInDate);
    const formattedCheckOutDate = Intl.DateTimeFormat('en-US', dateOpts).format(checkOutDate);
    const formattedCheckInTime = parse(booking.details.hotel.checkInTime, "HH:mm:ss", new Date()).toLocaleString('en-US', { hour: 'numeric' });
    const formattedCheckOutTime = parse(booking.details.hotel.checkOutTime, "HH:mm:ss", new Date()).toLocaleString('en-US', { hour: 'numeric' });

    if(!booking) {
        navigate("/");
    }

    return (
        <div className="ignore-safe-area-top px-10 space-y-7">
            <div className="grid font-[Inter] grid-cols-[1fr_1fr]">
                <div className="safe-area-top flex w-full flex-col items-baseline justify-center gap-11">
                    <InvoiceCard showCostBreakdown={false} invoice={booking.invoice} details={booking.details} />
                    <div className="flex flex-col gap-7">
                        <h1 className="text-lg font-semibold">Your trip starts {formattedCheckInDate}</h1>
                        <div className="grid grid-cols-[auto_auto] gap-x-10 gap-y-3 grid-rows-2">
                            <IconText Icon={CalendarArrowDown} textClassName="font-medium" fontSize={14} text={`Check-in`} />
                            <p>{formattedCheckInDate} from {formattedCheckInTime}</p>
                            <IconText Icon={CalendarArrowUp} textClassName="font-medium" fontSize={14} text={`Check-out`} />
                            <p>{formattedCheckOutDate} until {formattedCheckOutTime}</p>

                            <hr className="col-span-2"/>
                            <p>Total Price</p>
                            <p>${booking.invoice.totalPrice}</p>

                        </div>
                    </div>
                </div>
                <div className="text-[1.3em] font-semibold flex flex-col items-center justify-center gap-3">
                    <div className="rounded-full bg-green-100 p-4 w-fit h-fit flex items-center justify-center">
                        <Check className="stroke-green-600 stroke-3! w-[2em] h-[2em]"/>
                    </div>
                    <p>Your booking is now confirmed!</p>
                </div>
            </div>
        </div>
    )
}

export default SuccessBookingView
