import { getHotelById } from "@/api/hotel";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router";

const HotelView = () => {
    const { hotelId } = useLocation().state;
    const { data: hotel, isLoading } = useQuery({
        queryKey: ["hotel", hotelId],
        queryFn: () => getHotelById(hotelId)
    });
    
    useEffect(() => {
        console.log(hotel);
    }, hotel);

    return (
        <div className="mt-30 h-screen">
            <p>{hotel.name}</p>
        </div>
    )
}

export default HotelView;
