import { useEffect, useRef } from "react"

import gsap from "gsap"
import { useGSAP } from "@gsap/react";

interface SpringyButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: (e: any) => void;
    ref?: React.RefObject<any>;
}

const duration = 0.15;

const animateClick = (ref: React.RefObject<any>) => {
    gsap.to(ref.current, {
        scale: 0.95,
        duration,
    })
}

const reverseClickAnimation = (ref: React.RefObject<any>) => {
    gsap.to(ref.current, {
        scale: 1,
        duration,
    })
}

const SpringyButton = (props: SpringyButtonProps ) => {
    const gsapRef = useRef({} as HTMLButtonElement);
    window.addEventListener("mouseup", () => reverseClickAnimation(gsapRef));

    return (
        <button 
                onClick={props.onClick}
                onMouseDown={() => animateClick(gsapRef) } 
                onMouseUp={() => reverseClickAnimation(gsapRef) }
                ref={gsapRef} 
                className={`cursor-pointer font-[Outfit] bg-black px-5 py-2 rounded-sm ${props.className}`}>
            { props.children }
        </button>
    )
}

export default SpringyButton;
