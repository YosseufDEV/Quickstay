import type { BookingResponse } from "@/api/booking";

interface ReceiptCardProps {
    booking: BookingResponse["booking"];
    receipt: BookingResponse["receipt"];
    showCostBreakdown?: boolean;
}

const ReceiptCard = ({ booking, receipt, showCostBreakdown=true }: ReceiptCardProps) => {
    const formattingOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: 'long', day: '2-digit', year: 'numeric' };
    const formattedCheckInDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.timeRange?.from));
    const formattedCheckOutDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.timeRange?.to));

    return (
        <div className="min-w-100 w-150 bg-white space-y-5 font-[Inter] shadow-lg rounded-xl p-4" >

            <img src="http://localhost:5001/rooms/4.webp" alt={receipt?.roomType} className="w-full h-60 object-cover rounded-xl" />

            <p className="text-lg font-medium mt-2">{receipt.hotel?.name || "Placeholder" }</p>
            <div className="text-sm">
                <div className="grid grid-cols-[auto_auto] grid-rows-2">
                    <p className="font-medium">Check-in</p>
                    <p>{formattedCheckInDate}</p>
                    <p className="font-medium">Check-out</p>
                    <p>{formattedCheckOutDate}</p>
                </div>

                <hr className="my-4"/>

                <p className="font-medium col-span-2 row-span-2 self-center">{receipt?.roomType}</p>

                { showCostBreakdown && 
                <>
                    <div className="mb-7 gap-3 grid grid-cols-[auto_auto] grid-rows-2">
                        <p>Price per night</p>
                        <p>${receipt?.pricePerNight}</p>

                        <p>{receipt?.numberOfNights} Nights:</p>
                        <p>${receipt?.pricePerNight * receipt?.numberOfNights}</p>

                    </div>

                    <div className="mb-7 gap-3 grid grid-cols-[auto_auto]">
                        <p className="col-span-2 w-full row-span-2">Fees:</p>
                        {receipt?.fees.map((fee, index) => (
                            <>
                                <p key={receipt.hotelId + fee.type}>{fee.type} Fee: </p>
                                <p key={receipt.hotelId+fee.amount}>%{fee.amount}</p>
                            </>
                        ))}
                    </div>

                    <div className="mb-7 gap-3 grid grid-cols-[auto_auto] grid-rows-1">
                        <p>Total:</p>
                        <p>${receipt?.totalPrice}</p>
                    </div>
                </>
            }
            </div>
        </div>
    );
}

export default ReceiptCard;
