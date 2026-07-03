import FreeWifiIcon from "@/assets/freeWifiIcon.svg?react"; import FreeBreakfastIcon from "@/assets/freeBreakfastIcon.svg?react";
import MountainIcon from "@/assets/mountainIcon.svg?react";
import RoomServiceIcon from "@/assets/roomServiceIcon.svg?react";
import PoolAccessIcon from "@/assets/poolIcon.svg?react";
import type { slug } from "@quickstay/types/Hotel.ts";

interface HotelAmenityProps {
    slug: slug;
    iconClass?: string;
}

type amenity = {
    text: string;
    icon: any;
    style?: string;
}

const amenities: Record<slug, amenity> = {
    wifi: {
        text: "Free Wi-Fi",
        icon: FreeWifiIcon,
    },
    // TODO: replace this hardcoded icon class with something more dynamic, maybe pass it as a prop to the HotelAmenity component
    breakfast: {
        text: "Breakfast Included",
        style: "[&_path]:stroke-black! [&_path]:fill-none!",
        icon: FreeBreakfastIcon,
    },
    mountain: {
        text: "Mountain View",
        icon: MountainIcon,
    },
    service: {
        text: "Room Service",
        icon: RoomServiceIcon,
    },
    pool: {
        text: "Pool Access",
        icon: PoolAccessIcon,
    },
}

const HotelAmenity = (props: HotelAmenityProps) => {
    const amenity = amenities[props.slug];

    return amenity &&
        <div className="text-sm py-2 px-2.5 items-center justify-center bg-[#f0f0f7] text-black flex gap-2 rounded-lg">
            <amenity.icon className={ `[&_path]:fill-black w-[1.5em] h-[1.5em] ${amenity.style}` }/>
            <p className="font-[Inter] text-nowrap w-fit">{amenity.text}</p>
        </div>
}

export default HotelAmenity;
