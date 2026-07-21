import IconText from "@/Components/IconText/IconText";
import SpringyButton from "@/Components/SpringyButton/SpringyButton";
import { Building2, UsersRound } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { HotelContext } from "../HotelView";

interface RoomCardProps {
    available?: boolean,
    hotelId: string,
    imageUrl: string,
    pricePerNight: number,
    area: number,
    numberOfGuests: number,
    roomType: string,
}

const RoomCard = (props: RoomCardProps) => {
    const navigate = useNavigate();
    const { range, datePickerRef } = useContext(HotelContext);

    const handleBooking = () => {
        if(!range?.from || !range?.to) {
            datePickerRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        navigate("/booking", { state: { hotelId: props.hotelId, roomType: props.roomType, from: range?.from, to: range?.to } });
    }

    return (
        <div className="bg-white min-h-100 p-2 font-[Inter] items-start flex flex-col justify-between rounded-xl shadow-md">
            <div>
                <img src={props.imageUrl} alt="Room" className="mb-3 w-full h-45 aspect-3/2 object-cover rounded-lg" />
                <p className="text-xl">{props.roomType}</p>
                <div className="text-sm mt-3 w-full space-y-2">
                    <IconText text={`${props.area} sqm`} Icon={Building2} iconSize={1.3} fontSize={15} textClassName="text-gray-700" iconClassName="stroke-gray-700" />
                    <IconText text={`${props.numberOfGuests} guest${props.numberOfGuests==1?"":"s"}`} Icon={UsersRound} iconSize={1.3} fontSize={15} textClassName="text-gray-700" iconClassName="stroke-gray-700"  />
                </div>
            </div>
            <div className="text-sm mt-3 w-full">
                <SpringyButton disabled={ props.available || false }
                               onClick={handleBooking} 
                               className="text-white rounded-xl self-center text-lg w-full! bg-blue-700"
                               disabledClassName="bg-gray-300 opacity-80 [&>p]:text-gray-600 [&_span]:text-gray-400!"
                >
                    <p className="text-blue-50">Book Now for ${props.pricePerNight}<span className="text-blue-200 text-sm font-medium">/night</span></p>
                </SpringyButton>
            </div>
        </div>
    )
}

export default RoomCard;
