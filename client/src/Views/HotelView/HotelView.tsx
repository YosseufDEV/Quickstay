import { useEffect } from "react";
import { useLocation } from "react-router";

const HotelView = () => {
    const { hotelId } = useLocation().state;
    
    useEffect(() => {
        console.log(hotelId);
    }, []);

    return (
        <div className="bg-gray-800 h-screen">
        </div>
    )
}

export default HotelView;
