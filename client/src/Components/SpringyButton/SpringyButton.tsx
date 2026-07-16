import { useRef, useState } from "react"

import gsap from "gsap"
import { useGSAP } from "@gsap/react";

interface SpringyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

const SpringyButton = ({ ...props }: SpringyButtonProps) => {
    const gsapRef = useRef({} as HTMLButtonElement);
    const [clicked, setClicked] = useState(false);

    useGSAP(() => {
        if(clicked) {
            animateClick(gsapRef);
        } else {
            reverseClickAnimation(gsapRef);
        }
    }, [clicked]);

    window.addEventListener("mouseup", () => setClicked(false));

    return (
        <button 
                {...props}
                onClick={props.onClick}
                onMouseDown={() => setClicked(true)} 
                ref={(el) => { 
                    if(el) {
                        gsapRef.current = el; 
                        if(props.ref) props.ref.current = el; 
                    }
                }} 
                className={`cursor-pointer font-[Outfit] bg-black px-5 py-2 rounded-sm ${props.className}`}>
            { props.children }
        </button>
    )
}

export default SpringyButton;
