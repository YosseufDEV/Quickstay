import { useQuery } from "@tanstack/react-query";
import { ScrollRestoration, useSearchParams } from "react-router";

import { getHotels } from "@/api/hotel";
import type { IHotel } from "@quickstay/types/Hotel.ts";

import HotelCard from "./Components/HotelCard/HotelCard";
import FilterHotels from "../FilterHotels/FilterHotels";
import SkeletonHotelCard from "./Components/SkeletonHotelCard/SkeletonHotelCard";
import Pagination from "./Components/Pagination/Pagination";

const HotelsView = () => {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const hotelsPerPage = 10;

    const { data: hotels, isLoading } = useQuery({
        queryKey: ["hotels", page],
        queryFn: (): Promise<IHotel[]> => getHotels(hotelsPerPage, (page-1)*hotelsPerPage)
    });

    const mappedHotels = hotels?.map((hotel: IHotel) => <HotelCard key={hotel.id} { ...hotel } imageUrl={hotel.imageUrl} />);

    return (
        <>
            <div className="w-full bg-white space-y-15 content-container pt-30! grid grid-cols-[1.5fr_auto]">
                <div className="space-y-15" >
                    <div className="mb-15">
                        <p className="section-title">Hotels</p>
                        <p className="section-description">Take advantage of our limited-time offers and special packages to enhance <br/> your stay and create unforgettable memories.</p>
                    </div>
                    { isLoading ? <SkeletonHotelCard count={hotelsPerPage} /> : mappedHotels }
                </div>
                <FilterHotels />
            </div>

            <ScrollRestoration />

            <Pagination beforeAndAfter={2} page={page} />

        </>
    )
}

export default HotelsView 
