import { useRef } from "react"

import { useGSAP } from "@gsap/react"

import gsap from "gsap"

interface SpringyButtonProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    ref?: React.RefObject<any>;
}

const animateClick = (ref: React.RefObject<any>) => {
    gsap.to(ref.current, {
        scale: 0.9,
        duration: 0.1,
    })
}

const reverseClickAnimation = (ref: React.RefObject<any>) => {
    gsap.to(ref.current, {
        scale: 1,
        duration: 0.1,
    })
}

const SpringyButton = (props: SpringyButtonProps ) => {
    const gsapRef = useRef({} as HTMLButtonElement);

    window.onmouseup = () => reverseClickAnimation(gsapRef);

    return (
        <button 
                onClick={props.onClick}
                onMouseDown={() => animateClick(gsapRef) } 
                ref={(el) => { 
                    if(el && props.ref) {
                        gsapRef.current = el; 
                        props.ref.current = el; 
                    }
                }} 
                className={`cursor-pointer font-[Outfit] bg-black px-5 py-2 rounded-sm ${props.className}`}>
            { props.children }
        </button>
    )
}

export default SpringyButton;
