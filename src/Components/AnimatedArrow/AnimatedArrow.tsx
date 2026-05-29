import ArrowIcon from "@/assets/arrowIcon.svg?react"
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedArrowProps {
    text: string,
    size?: number,
    color?: string,
}

const AnimatedArrow = ({ text="", size=25, color="#fff" }: AnimatedArrowProps) => {
    const currentRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    useGSAP(() =>{
        gsap.to(".arrow path", { stroke: color, width: `${size}px`, height: `${size}px`, duration: 0 }) 

        gsap.to(".arrow", { left: hovered ? "5px" : 0, duration: 0.1 });

    }, { scope: currentRef, dependencies: [hovered] })

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} ref={currentRef} className="flex items-center gap-2 cursor-pointer h-fit">
            { text }
            <ArrowIcon  className="arrow stroke-white relative"/>
        </div>
    )
}

export default AnimatedArrow;
