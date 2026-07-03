import { getHotelById } from "@/api/hotel";
import { useQuery } from "@tanstack/react-query";
import { ScrollRestoration, useLocation } from "react-router";
import type { IHotel } from "@quickstay/types/Hotel";
import HotelAmenity from "../HotelsView/Components/HotelAmenity/HotelAmenity.tsx";
import StarsRating from "@/Components/StarsRating/StarsRating";
import Location from "@/Components/Location/Location";
import SkeletonHotelView from "./Components/SkeletonHotelsView";
import RoomCard from "./Components/RoomCard.tsx";

const HotelView = () => {
    const { hotelId } = useLocation().state;

    const { data: hotel, status } = useQuery({
        queryKey: ["hotel", hotelId],
        queryFn: (): Promise<IHotel> => getHotelById(hotelId)
    });

    console.log(hotel);
    
    return ( status=="success" ?
        <div className="min-h-screen">
            <div className="bg-[#fdfdfd] pt-30! mb-10 content-container flex flex-col gap-5">
                <p className="font-Playfair text-3xl font-medium">{hotel.name}</p>

                <StarsRating rating={hotel.rating} showRating categorized />

                <Location address={hotel.address} />

                <div className="grid grid-cols-[auto_auto_auto] grid-rows-2 items-stretch w-fit gap-x-5 gap-y-4">

                { /* FIX: Image aspect-ratio */ }
                <img src={hotel.imageUrl} className="row-span-2 object-cover aspect-3/2 rounded-xl shadow-md" />

                { Array.from({ length: 4 }).map((_, index) => (
                    <img key={index} src={hotel.imageUrl} className="object-cover w-70 aspect-3/2 rounded-xl shadow-md" />
                )) }

                </div>
                    <div className="flex flex-row items-center gap-2">
                    { hotel.amenities.map((amenity) => <HotelAmenity key={amenity.id} slug={amenity.slug} />) }
                </div> 

            </div>
            <div className="bg-secondary flex flex-col items-center content-container">
                <p className="font-Playfair text-3xl mb-10">Rooms</p>
                <div className="flex items-center justify-start gap-5">
                    {hotel.catalog.map((room) => <RoomCard {...room} />)}
                </div>
            </div>
        </div>
        : <SkeletonHotelView />
    )

}

export default HotelView;
