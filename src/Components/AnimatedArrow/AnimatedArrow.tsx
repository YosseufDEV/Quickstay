import ArrowIcon from "@/assets/arrowIcon.svg?react"
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface AnimatedArrowProps {
    size?: number,
    color?: string,
    hovered: boolean,
}

const AnimatedArrow = ({ hovered=false, size=25, color="#fff" }: AnimatedArrowProps) => {
    const currentRef = useRef(null);

    useGSAP(() =>{
        gsap.to(".arrow path", { stroke: color, width: `${size}px`, height: `${size}px`, duration: 0 }) 

        gsap.to(".arrow", { left: hovered ? "5px" : 0, duration: 0.1 });

    }, { scope: currentRef, dependencies: [hovered] })

    return (
        <div ref={currentRef} className="flex items-center gap-2 cursor-pointer h-fit">
            <ArrowIcon  className="arrow stroke-white relative"/>
        </div>
    )
}

export default AnimatedArrow;
