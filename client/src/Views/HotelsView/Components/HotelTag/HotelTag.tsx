import FreeWifiIcon from "@/assets/freeWifiIcon.svg?react"; import FreeBreakfastIcon from "@/assets/freeBreakfastIcon.svg?react";
import MountainIcon from "@/assets/mountainIcon.svg?react";
import RoomServiceIcon from "@/assets/roomServiceIcon.svg?react";
import PoolAccessIcon from "@/assets/poolIcon.svg?react";
import type { slag } from "@quickstay/types/Hotel.ts";

interface HotelTagProps {
    slag: slag;
    iconClass?: string;
}

type tag = {
    text: string;
    icon: any;
    style?: string;
}

const tags: Record<slag, tag> = {
    wifi: {
        text: "Free Wi-Fi",
        icon: FreeWifiIcon,
    },
    // TODO: replace this hardcoded icon class with something more dynamic, maybe pass it as a prop to the HotelTag component
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


const HotelTag = (props: HotelTagProps) => {
    const tag = tags[props.slag];

    return tag &&
        <div className="text-sm py-2 px-2 w-fit items-center justify-center bg-[#f0f0f7] text-black flex gap-2 rounded-lg">
            <tag.icon className={ `[&_path]:fill-black w-[1.5em] h-[1.5em] ${tag.style}` }/>
            <p className="font-[Inter] w-full">{tag.text}</p>
        </div>
}

export default HotelTag;
