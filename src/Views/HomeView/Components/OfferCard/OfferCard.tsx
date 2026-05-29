import AnimatedArrow from "@/Components/AnimatedArrow/AnimatedArrow";
import { useHover } from "@/hooks/customHooks";
import { useRef } from "react";

interface OfferProps {
    title: string,
    description: string,
    expiry: string,
    discount: number,
    imgSrc: any,
}

const OfferCard = (props: OfferProps) => {
    const arrowParentRef = useRef(null);
    const hovered = useHover(arrowParentRef);

    return (
        <div className="font-[Outfit] text-white p-5 relative h-65 w-full bg-cover rounded-2xl flex flex-col justify-between" style={{backgroundImage: `url(${props.imgSrc})`}}>
            <div className="bg-white rounded-3xl w-fit text-black text-[13px] py-0.5 px-2.5">
                <p>{props.discount}% OFF</p>
            </div>
            <div className="flex flex-col justify-center items-start gap-1">
                <p className="text-white text-2xl">{props.title}</p>
                <p>{props.description}</p>
                <p className="text-gray-300 text-sm">Expires {props.expiry}</p>
            </div>
            <div ref={arrowParentRef} className="flex items-center gap-1 font-semibold cursor-pointer">
                <p>View Offers</p>
                <AnimatedArrow hovered={hovered} />
            </div>
        </div>
    )
}

export default OfferCard;
