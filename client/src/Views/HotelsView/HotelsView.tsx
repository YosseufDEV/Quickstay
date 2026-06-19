import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { getHotels } from "@/api/hotel";

import type { IHotel } from "@quickstay/types/Hotel.ts";

import HotelCard from "./Components/HotelCard/HotelCard";
import FilterHotels from "../FilterHotels/FilterHotels";
import SkeletonHotelCard from "./Components/SkeletonHotelCard/SkeletonHotelCard";
import Pagination from "./Components/Pagination/Pagination";

const HotelsView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const hotelsPerPage = 10;

    const { data: hotels, isLoading } = useQuery({
        queryKey: ["hotels", page],
        queryFn: (): Promise<IHotel[]> => getHotels(hotelsPerPage, (page-1)*hotelsPerPage)
    });

    window.onclick = (e) => {
        setSearchParams({ page: String(page+1) });
    }

    const mappedHotels = hotels?.map((hotel: IHotel) => <HotelCard key={hotel.id} { ...hotel } imageUrl={`http://localhost:5001/${hotel.imageUrl}`} />);

    return (
        <>
        <div className="w-full bg-white content-container pt-30! grid grid-cols-[1.5fr_1fr]">
            <div>
                <p className="section-title">Hotel Rooms</p>
                <p className="section-description mb-10">Take advantage of our limited-time offers and special packages to enhance <br/> your stay and create unforgettable memories.</p>
                { isLoading ? <SkeletonHotelCard count={10} /> : mappedHotels }
            </div>
            <div className="flex items-start justify-center">
                <FilterHotels />
            </div>
        </div>

        <Pagination page={page} />

        </>
    )
}

export default HotelsView 
