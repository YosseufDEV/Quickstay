import StarsRating from "@/Components/StarsRating/StarsRating";
import HotelTag from "../HotelTag/HotelTag";
import LocationPinIcon from "@/assets/locationIcon.svg?react";

interface HotelCardProps {
    name: string;
    location: string;
    locationHotel: string;
    pricePerNight: number;
    rating: number;
    imageSrc: string;
    tags: {text: string, icon: any }[];
}

const HotelCard = (props: HotelCardProps) => {
    console.log(props.tags);
    return (
        <div className="font-[Inter] flex gap-10 w-fit">
            <img className="w-90 h-fit rounded-xl" src={props.imageSrc} />

            <div className= "flex flex-col gap-3 justify-between items-start">
                <p className="text-sm text-gray-500">{props.locationHotel}</p>
                <p className="text-2xl font-Playfair">{props.name}</p>
                <div className="flex flex-row gap-3">
                    <StarsRating rating={Math.max(props.rating)} />
                    <p className="text-sm font-[Inter]">200+ reviews</p>
                </div>
                <div className="flex gap-2 justify-center items-center text-gray-500 text-sm">
                    <LocationPinIcon />
                    <p>{props.location}</p> 
                </div>
                <div className="grid grid-cols-[auto_auto_auto] gap-x-3 gap-y-3 full max-2xl:grid-cols-[auto_auto] max-2xl:grids-rows-2">
                    {props.tags.map((tag, index) => <HotelTag key={index} iconClass={tag.iconClass} Icon={tag.icon} text={tag.text} />)}
                </div>
                <div className="flex flex-row gap-0.5 items-center mb-2">
                    <p className="text-lg font-medium">${props.pricePerNight}/night</p>
                </div>
            </div>

        </div>
    )
}

export default HotelCard;
