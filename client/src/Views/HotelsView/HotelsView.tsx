import { useQuery } from "@tanstack/react-query";

import RoomImage1 from "@/assets/roomImg1.png";
import RoomImage2 from "@/assets/roomImg2.png";
import RoomImage3 from "@/assets/roomImg3.png";
import RoomImage4 from "@/assets/roomImg4.png";
import HotelCard from "./Components/HotelCard/HotelCard";

import FreeWifiIcon from "@/assets/freeWifiIcon.svg?react";
import FreeBreakfastIcon from "@/assets/freeBreakfastIcon.svg?react";
import MountainIcon from "@/assets/mountainIcon.svg?react";
import RoomServiceIcon from "@/assets/roomServiceIcon.svg?react";
import PoolAccessIcon from "@/assets/poolIcon.svg?react";
import FilterHotels from "../FilterHotels/FilterHotels";


import SkeletonHotelCard from "./Components/SkeletonHotelCard/SkeletonHotelCard";
import Skeleton from "react-loading-skeleton";
import { getHotels } from "@/api/hotel";
import { useEffect } from "react";
import axios from "axios";

const tags = {
    freeWifi: {
        text: "Free Wi-Fi",
        icon: FreeWifiIcon,
    },
    // TODO: replace this hardcoded icon class with something more dynamic, maybe pass it as a prop to the HotelTag component
    freeBreakfast: {
        text: "Breakfast Included",
        iconClass: "[&_path]:stroke-black! [&_path]:fill-none!",
        icon: FreeBreakfastIcon,
    },
    mountainView: {
        text: "Mountain View",
        icon: MountainIcon,
    },
    roomService: {
        text: "Room Service",
        icon: RoomServiceIcon,
    },
    poolAccess: {
        text: "Pool Access",
        icon: PoolAccessIcon,
    },
}

const data = [
    {
        id: 1,
        name: "The Grand Resort",
        pricePerNight: 200,
        rating: 4.5,
        tags: [tags.freeWifi, tags.poolAccess, tags.mountainView],
        locationHotel: "Skyline Boulevard, CA, USA",
        location: "Los Angelos, California, USA",
        imageSrc: RoomImage1,
    },
    {
        id: 2,
        name: "The Regal Palace",
        pricePerNight: 350,
        rating: 4.8,
        tags: [tags.freeWifi, tags.freeBreakfast, tags.roomService],
        location: "Miami, Florida, USA",
        locationHotel: "Ocean Drive, FL, USA",
        imageSrc: RoomImage2,
    },
    {
        id: 3,
        name: "Velvet Nights Inn",
        pricePerNight: 150,
        rating: 4.2,
        tags: [tags.freeWifi, tags.freeBreakfast, tags.roomService],
        location: "Chicago, Illinois, USA",
        locationHotel: "Magnificent Mile, IL, USA",
        imageSrc: RoomImage3,
    },  
    {
        id: 4,
        name: "Crystal Waters Resort",
        pricePerNight: 300,
        rating: 4.7,
        tags: [tags.freeWifi, tags.freeBreakfast, tags.mountainView],
        location: "New York, New York, USA",
        locationHotel: "5th Avenue, NY, USA",
        imageSrc: RoomImage4,
    },
    {   
        id: 5,
        name: "Skyline Luxe Hotel",
        pricePerNight: 250,
        rating: 4.6,
        location: "Orlando, Florida, USA",
        locationHotel: "International Drive, FL, USA",
        tags: [tags.freeWifi, tags.freeBreakfast, tags.poolAccess],
        imageSrc: RoomImage1,
    },
]

const HotelsView = () => {

    const { data: hotels, isPending, isLoading } = useQuery({
        queryKey: ["hotels"],
        queryFn: async () => await getHotels(1000)
    });

    const mappedHotels = hotels?.map((hotel, i: number) => <><HotelCard key={hotel.id} { ...hotel } imageUrl={`http://localhost:5001/${hotel.imageUrl.split("/").pop()}`} /> { (i!=data.length-1) && <hr className="my-15 border-gray-500"/> }</>);

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
                { mappedHotels }
                {/* { !isLoading ? hotels.map((hotel) => <img src={`http://localhost:5001/${hotel.imageUrl.split("/").pop()}`}  className="w-50" alt={hotel.name} />) : null } */}
            </div>
            <div className="flex items-start justify-center">
                <FilterHotels />
            </div>
        </div>
    )
}

export default HotelsView 
