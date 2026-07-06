import SpringyButton from "@/Components/SpringyButton/SpringyButton";

interface RoomCardProps {
    imageUrl: string,
    pricePerNight: number,
    area: number,
    numberOfGuests: number,
    roomType: string,
}

const RoomCard = (props: RoomCardProps) => {
    return (
        <div className="bg-white min-h-100 p-2 font-[Inter] items-start flex flex-col justify-between rounded-xl shadow-md">
            <div>
                <img src={props.imageUrl} alt="Room" className="mb-3 w-full h-45 aspect-3/2 object-cover rounded-lg" />
                <p className="text-xl">{props.roomType}</p>
                <div className="text-sm mt-3 w-full">
                    <p>{props.area} sqm</p>
                    <p>{props.numberOfGuests} guest{props.numberOfGuests==1?"":"s"}</p>
                </div>
            </div>
            <div className="text-sm mt-3 w-full">
                <SpringyButton className="text-white rounded-xl self-center text-lg w-full! bg-blue-700">
                    <p className="text-blue-50">Book Now for ${props.pricePerNight} <span className="text-blue-200 text-sm font-medium">/night</span></p>
                </SpringyButton>
            </div>
        </div>
    )
}

export default RoomCard;
