import StarsRating from "@/Components/StarsRating/StarsRating";
import HotelTag from "../HotelTag/HotelTag";
import LocationPinIcon from "@/assets/locationIcon.svg?react";
import { NavLink } from "react-router";
import type { ITag } from "@quickstay/types/Hotel.ts";
import Location from "@/Components/Location/Location";

interface HotelCardProps {
    id: string;
    name: string;
    address: string;
    exactAddress: string;
    rating: number;
    imageUrl: string;
    tags: ITag[];
    rooms: {
        pricePerNight: number;
    }[]
}

const HotelCard = (props: HotelCardProps) => {
    const lowestPrice = Math.min(...props.rooms.map(room => room.pricePerNight));
    console.log(props);
    return (
        <>
            <div className="font-[Inter] flex gap-10 w-fit">
                <img className="w-90 aspect-3/2 h-fit rounded-xl shadow-md" src={props.imageUrl} />

                <div className= "flex flex-col gap-3 justify-between items-start">
                    <p className="text-sm text-gray-500">{props.exactAddress}</p>

                    <NavLink state={{ hotelId: props.id }} 
                    // TODO : fix this regex
                             to={`/hotels/${props.name.toLowerCase().replace(/(\W)/g, "-")}`} 
                             className="no-underline! text-black! font-normal!">
                        <p className="text-2xl font-Playfair">{props.name}</p>
                    </NavLink>

                    <div className="flex flex-row gap-3 items-center">
                        <StarsRating showRating categorized rating={Math.max(props.rating)} />
                        <p className="text-sm font-[Outfit]">200+ reviews</p>
                    </div>
                    <Location address={props.address} />
                    <div className="grid grid-cols-[auto_auto_auto] gap-x-3 gap-y-3 full max-2xl:grid-cols-[auto_auto] max-2xl:grids-rows-2">
                        {props.tags.map((tag, index) => <HotelTag key={index} slag={tag.slag} />)}
                    </div>
                    <div className="flex flex-row gap-0.5 items-center mb-2">
                        <p className="text-lg font-medium">${lowestPrice} /night</p>
                    </div>
                </div>
            </div>
            <hr />
        </>
    )
}

export default HotelCard;
