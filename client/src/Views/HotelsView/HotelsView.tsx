import { useQuery } from "@tanstack/react-query";

import { getHotels } from "@/api/hotel";

import type { IHotel } from "@quickstay/types/Hotel.ts";

import HotelCard from "./Components/HotelCard/HotelCard";
import FilterHotels from "../FilterHotels/FilterHotels";
import SkeletonHotelCard from "./Components/SkeletonHotelCard/SkeletonHotelCard";

const HotelsView = () => {
    const { data: hotels, isLoading } = useQuery({
        queryKey: ["hotels"],
        queryFn: (): Promise<IHotel[]> => getHotels(10)
    });

    const mappedHotels = hotels?.sort((a,b) => b.rating-a.rating).map((hotel, i: number) => <><HotelCard key={hotel.id} { ...hotel } imageUrl={`http://localhost:5001/${hotel.imageUrl}`} /> { (i!=hotels.length-1) && <hr className="my-15 border-gray-500"/> }</>);

    return (
        <div className="w-full bg-white mb-20 content-container pt-30! grid grid-cols-[1.5fr_1fr]">
            <div>
                <p className="section-title">Hotel Rooms</p>
                <p className="section-description mb-10">Take advantage of our limited-time offers and special packages to enhance <br/> your stay and create unforgettable memories.</p>
                { isLoading ? <SkeletonHotelCard count={10} /> : mappedHotels }
            </div>
            <div className="flex items-start justify-center">
                <FilterHotels />
            </div>
        </div>
    )
}

export default HotelsView 
