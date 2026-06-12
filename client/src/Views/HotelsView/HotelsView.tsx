import { useQuery } from "@tanstack/react-query";

import HotelCard from "./Components/HotelCard/HotelCard";
import FilterHotels from "../FilterHotels/FilterHotels";

import { getHotels } from "@/api/hotel";
import { useEffect } from "react";
import type { IHotel } from "@quickstay/types/Hotel.ts";

const HotelsView = () => {

    const { data: hotels, isLoading } = useQuery({
        queryKey: ["hotels"],
        queryFn: (): Promise<IHotel[]> => getHotels(10)
    });

    const mappedHotels = hotels?.map((hotel, i: number) => <><HotelCard key={hotel.id} { ...hotel } imageUrl={`http://localhost:5001/${hotel.imageUrl}`} /> { (i!=hotels.length-1) && <hr className="my-15 border-gray-500"/> }</>);

    useEffect(() => {
        console.log(hotels);
    }, [hotels]);

    return (
        <div className="w-full bg-white mb-20 content-container pt-30! grid grid-cols-[auto_1fr]">
            <div>
                <p className="section-title">Hotel Rooms</p>
                <p className="section-description mb-10">Take advantage of our limited-time offers and special packages to enhance <br/> your stay and create unforgettable memories.</p>
                {/* <SkeletonHotelCard /> */}
                {/* <Skeleton width={360} height={240} className="bg-red" containerClassName="flex-1" /> */}
                { !isLoading && mappedHotels }
                {/* { !isLoading ? hotels.map((hotel) => <img src={`http://localhost:5001/${hotel.imageUrl.split("/").pop()}`}  className="w-50" alt={hotel.name} />) : null } */}
            </div>
            <div className="flex items-start justify-center">
                <FilterHotels />
            </div>
        </div>
    )
}

export default HotelsView 
