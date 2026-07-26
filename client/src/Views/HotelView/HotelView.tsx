import { getHotelById } from "@/api/hotel";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
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
import { createContext, useEffect, useRef, useState, type RefObject } from "react";
import { formatDate } from "date-fns";
import { checkAvailability } from "@/api/booking.ts";

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
    datePickerRef: null as unknown as RefObject<HTMLDivElement> | null
})

const isValidRangeParams = (checkinStr: string | null, checkoutStr: string | null) => {
    if(!checkinStr || !checkoutStr) return { isCheckinValid: !!checkinStr, isCheckoutValid: !!checkoutStr };

    const checkinTime = new Date(checkinStr).getTime();
    const checkoutTime = new Date(checkoutStr).getTime();

    let isCheckinValid = !isNaN(checkinTime);
    let isCheckoutValid = !isNaN(checkoutTime);

    const today = new Date().setHours(0, 0, 0, 0); // Set to midnight for comparison

    if(checkinTime < today) isCheckinValid = false;
    if(checkoutTime <= checkinTime) isCheckoutValid = false;
    if(checkoutTime < today + (1000 * 60 * 60 * 24)) isCheckoutValid = false; // Checkout must be at least 1 day after checkin

    return {
        isCheckinValid,
        isCheckoutValid
    }
}

const HotelView = () => {
    const { hotelId } = useParams() as { hotelId: string };
    const [searchParams, setSearchParams] = useSearchParams();

    const checkInParam = searchParams.get("checkin");
    const checkOutParam = searchParams.get("checkout");

    const { isCheckinValid, isCheckoutValid } = isValidRangeParams(checkInParam, checkOutParam);
    const [availability, setAvailability] = useState({});

    // INFO: Range for booking, checkin and checkout
    const [range, setRange] = useState<{ from: Date, to: Date }>({
        from: isCheckinValid ? new Date(checkInParam) : null,
        to: isCheckoutValid ? new Date(checkOutParam) : null, 
    });

    useEffect(() => {
        if(!range.from && !range.to) return;

        setSearchParams({
            ...(range.from ? { checkin: formatDate(range.from, 'yyyy-MM-dd') } : {} ),
            ...(range.to ? { checkout: formatDate(range.to, 'yyyy-MM-dd') } : {} ),
        }, { preventScrollReset: true });

        if(range.from && range.to) {
            const checkinTime = range.from;
            const checkoutTime = range.to;
            checkAvailability(hotelId, checkinTime, checkoutTime).then((availabilityResponse) => {
                setAvailability(availabilityResponse);
                console.log("Availability response:", availabilityResponse);
            }).catch((error) => {
                console.error("Error checking availability:", error);
            });
        }

    }, [range]);

    const datePickerRef = useRef(null as unknown as HTMLDivElement | null);

    const { data: hotel, status } = useQuery({
        queryKey: ["hotel", hotelId],
        queryFn: (): Promise<Hotel> => getHotelById(hotelId)
    });

    console.log("HotelView: hotel data", hotel, "status", status);
    
    return ( status=="success" ?
        <HotelContext.Provider value={{ range, datePickerRef }}>
            <div className="min-h-screen w-full">
                <div className="bg-[#fdfdfd] w-full mb-10 content-container flex flex-col gap-5">
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

                    <DatePicker ref={datePickerRef} range={range} setRange={setRange}/>

                    <div className="flex flex-row items-center gap-2">
                        { hotel.amenities.map((amenity) => <HotelAmenity key={amenity.id} slug={amenity.slug} />) }
                    </div> 

                </div>
                <div className="bg-secondary flex flex-col items-center content-container">
                    <p className="font-Playfair text-3xl mb-10">Rooms</p>
                    <div className="flex items-center justify-start gap-5">
                    { /* TODO: Implement availability logic */ }
                        {hotel.catalog.map((room) => <RoomCard roomTypeId={room.id} available={Math.random() > 0.5} {...room} hotelId={hotel.id} />)}
                    </div>
                </div>
            </div>
        </HotelContext.Provider>
        : <SkeletonHotelView />
    )

}

export default HotelView;
