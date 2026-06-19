import { getHotelById } from "@/api/hotel";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollRestoration, useLocation } from "react-router";
import type { IHotel } from "@quickstay/types/Hotel";
import HotelTag from "../HotelsView/Components/HotelTag/HotelTag";
import StarsRating from "@/Components/StarsRating/StarsRating";
import Location from "@/Components/Location/Location";
import SkeletonHotelView from "./SkeletonHotelsView";

const HotelView = () => {
    const { hotelId } = useLocation().state;

    const { data: hotel, isLoading, status } = useQuery({
        queryKey: ["hotel", hotelId],
        queryFn: (): Promise<IHotel> => getHotelById(hotelId)
    });
    
    return ( status=="success" ?
        <div className="bg-[#fdfdfd] pt-30! content-container h-screen flex flex-col gap-5">
            <p className="font-Playfair text-3xl font-medium">{hotel.name}</p>

            <StarsRating rating={hotel.rating} showRating categorized />

            <Location address={hotel.address} />

            <div className="grid grid-cols-[auto_auto_auto] grid-rows-2 items-stretch w-fit gap-x-5 gap-y-4">

            <img src={`http://localhost:5001/${hotel.imageUrl}`} className="w-150 row-span-2 object-cover aspect-3/2 rounded-xl shadow-md" />

            { Array.from({ length: 4 }).map((_, index) => (
                <img key={index} src={`http://localhost:5001/${hotel.imageUrl}`} className="object-cover w-70 aspect-3/2 rounded-xl shadow-md" />
            )) }

            </div>
                <div className="flex flex-row items-center gap-2">
                { hotel.tags.map((tag) => <HotelTag key={tag.id} slag={tag.slag} />) }
            </div> 
            <ScrollRestoration />
        </div>
            : <SkeletonHotelView />
    )

}

export default HotelView;
