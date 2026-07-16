import BackwardArrow from "@/Components/BackwardArrow/BackwardArrow";
import ReceiptCard from "./Components/ReceiptCard";
import { useId } from "react";
import * as Payment from "./Components/PaymentForm";

const BookingView = () => {
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

    return (
        <div className="mt-30 grid grid-cols-[2fr_1fr] min-h-screen w-screen">
            <div className="p-10 flex flex-col gap-5">
                <BackwardArrow />
                <p className="font-bold text-xl">Book {receipt.hotel.name}</p>
                <div className="w-full h-full">
                    <Payment.PaymentContainer formId={formId} />
                </div>
            </div>
            <div className="p-10 flex justify-start flex-col gap-10">
                <ReceiptCard hotel={receipt.hotel} room={receipt.room} booking={receipt.booking} />
                <Payment.PaymentButton formId={formId} />
            </div>
        </div>
    )
}

export default BookingView;
