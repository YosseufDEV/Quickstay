import { getHotelById } from "@/api/hotel";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import type { IHotel, slug } from "@quickstay/types/Hotel";
import HotelAmenity from "../HotelsView/Components/HotelAmenity/HotelAmenity.tsx";
import StarsRating from "@/Components/StarsRating/StarsRating";
import Location from "@/Components/Location/Location";
import SkeletonHotelView from "./Components/SkeletonHotelsView";
import RoomCard from "./Components/RoomCard.tsx";
import Arrow from "@/assets/arrowLeft.svg?react"
import { ArrowLeft } from "lucide-react";
import BackwardArrow from "@/Components/BackwardArrow/BackwardArrow.tsx";
import DatePicker from "@/Components/DatePicker/DatePicker.tsx";
import { createContext, useState } from "react";

interface Hotel {
    id: string;
    name: string;
    address: string;
    exactAddress: string;
    rating: number;
    imageUrl: string;
    amenities: { id: number; slug: slug }[];
    catalog: { id: string; roomType: string, pricePerNight: number; imageUrl: string, area: number, numberOfGuests: number }[];
}

export const HotelContext = createContext({
    range: null as unknown as { from: Date, to: Date } | null,
})

const HotelView = () => {
    const { hotelId } = useLocation().state;
    // INFO: Range for booking, checkin and checkout
    const [range, setRange] = useState<{ from: Date, to: Date }>();
    const navigate = useNavigate();

    const { data: hotel, status } = useQuery({
        queryKey: ["hotel", hotelId],
        queryFn: (): Promise<Hotel> => getHotelById(hotelId)
    });
    
    return ( status=="success" ?
        <HotelContext.Provider value={{ range }}>
            <div className="min-h-screen w-full">
                <div className="bg-[#fdfdfd] pt-30! w-full mb-10 content-container flex flex-col gap-5">
                    <BackwardArrow />
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

                    <DatePicker range={range} setRange={setRange}/>

                    <div className="flex flex-row items-center gap-2">
                        { hotel.amenities.map((amenity) => <HotelAmenity key={amenity.id} slug={amenity.slug} />) }
                    </div> 

                </div>
                <div className="bg-secondary flex flex-col items-center content-container">
                    <p className="font-Playfair text-3xl mb-10">Rooms</p>
                    <div className="flex items-center justify-start gap-5">
                        {hotel.catalog.map((room) => <RoomCard {...room} hotelId={hotel.id} />)}
                    </div>
                </div>
            </div>
        </HotelContext.Provider>
        : <SkeletonHotelView />
    )

}

export default HotelView;
