import AnimatedArrow from "@/Components/AnimatedArrow/AnimatedArrow";
import SpringyButton from "@/Components/SpringyButton/SpringyButton";
import { useHover } from "@/hooks/customHooks";
import { useRef } from "react";

const Newsletter = () => {
    const description = "Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration.";

    const buttonRef = useRef(null);
    const hovered = useHover(buttonRef);

    return (
        <div className="content-container py-25! text-white font-[Outfit] min-h-[30vh] bg-white flex items-center justify-center flex-col">
            <div className="bg-[#101828] flex items-center justify-center flex-col gap-6 px-25 py-15 rounded-xl">
                <p className="text-[36px] font-[Playright]">Stay Inspired</p>
                <p className="text-gray-500 max-w-180 text-center">{description}</p>
                <form className="w-fit px-3 flex flex-col items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-center gap-4">
                        <input className="w-full bg-[#28303e] py-2 px-3 rounded-sm border border-gray-500" placeholder="Enter your Email"/>
                        <SpringyButton ref={buttonRef}>
                            <div className="flex items-center justify-center gap-2">
                                <p>Subscribe</p>
                                <AnimatedArrow hovered={hovered} />
                            </div>
                        </SpringyButton>
                    </div>
                    <p className="text-[13px] text-gray-500">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
                </form>
            </div>
        </div>
    )
}

export default Newsletter;
