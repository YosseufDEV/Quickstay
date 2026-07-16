interface RoomCardProps {
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

const RoomCard = ({ room, booking, hotel }: RoomCardProps) => {
    const formattingOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: 'long', day: '2-digit', year: 'numeric' };
    const formattedCheckInDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.checkInDate));
    const formattedCheckOutDate = Intl.DateTimeFormat('en-US', formattingOptions).format(new Date(booking.checkOutDate));
    const numberOfNights = (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24);

    return (
        <div className="max-w-130 min-w-100 bg-white space-y-5 font-[Inter] shadow-lg rounded-lg p-2" >
            <img src={room.imageUrl} alt={room.type} className="w-full h-60 object-cover rounded-lg" />
            <p className="text-lg font-medium mt-2">{hotel.name}</p>
            <div className="text-sm">
                <div className="mb-7 grid grid-cols-[auto_auto] grid-rows-2">
                    <p className="font-medium">Check-Out</p>
                    <p>{formattedCheckInDate}</p>
                    <p className="font-medium">Check-In</p>
                    <p>{formattedCheckOutDate}</p>
                </div>
                <div className="mb-7 gap-3 grid grid-cols-[auto_auto] grid-rows-2">
                    <p className="font-medium col-span-2 row-span-2 self-center">{room.type}</p>

                    <p>Price per night</p>
                    <p>${room.price}</p>

                    <p>{numberOfNights} Nights:</p>
                    <p>${room.price * numberOfNights}</p>

                    <p>Total:</p>
                    <p>${room.price * numberOfNights}</p>
                </div>
            </div>
        </div>
    );
}

export default RoomCard;
