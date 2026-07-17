import type { BookingResponse } from "@/api/booking";

interface ReceiptCardProps {
    room: {
        id: string,
        imageUrl: string,
        type: string,
        number: number,
        price: number,
        // amenities: string[],
    },
    hotel: {
        id: string,
        name: string,
    },
    booking: {
        checkInDate: string,
        checkOutDate: string,
    }
}

const ReceiptCard = ({ booking, receipt }: BookingResponse) => {
    console.log("Recieved Booking", booking);
    console.log("Recieved Receipt", receipt);
    const formattingOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: 'long', day: '2-digit', year: 'numeric' };
    const formattedCheckInDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.timeRange?.from));
    const formattedCheckOutDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.timeRange?.to));

    return (
        <div className="max-w-130 min-w-100 bg-white space-y-5 font-[Inter] shadow-lg rounded-lg p-2" >
            <img src="http://localhost:5001/rooms/4.webp" alt={receipt?.roomType} className="w-full h-60 object-cover rounded-lg" />
            <p className="text-lg font-medium mt-2">Hotel Placeholder</p>
            <div className="text-sm">
                <div className="mb-7 grid grid-cols-[auto_auto] grid-rows-2">
                    <p className="font-medium">Check-Out</p>
                    <p>{formattedCheckInDate}</p>
                    <p className="font-medium">Check-In</p>
                    <p>{formattedCheckOutDate}</p>
                </div>
                <div className="mb-7 gap-3 grid grid-cols-[auto_auto] grid-rows-2">
                    <p className="font-medium col-span-2 row-span-2 self-center">{receipt?.roomType}</p>

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
            </div>
        </div>
    );
}

export default ReceiptCard;
