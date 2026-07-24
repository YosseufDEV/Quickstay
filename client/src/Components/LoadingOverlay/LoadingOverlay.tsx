import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Classic } from "../classic";

const LoadingOverlay = ({ isVisible=true }) => {
    useGSAP(() => {
      gsap.fromTo(".loading-overlay", 
            {
                opacity: 0,
                duration: 0.3,
            },
            {
                duration: 0.3,
                opacity: 1,
            })

    }, [isVisible]);

    useEffect(() => {
        if(isVisible) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }
    }, [isVisible]);

    return ( isVisible &&
            <div className="loading-overlay fixed bg-black/50 z-2000 w-full h-full inset-0">
                <Classic className="absolute text-gray-200 bottom-[50%] left-[50%] z-400 w-15 h-15"/>
            </div>
    )
}

export default LoadingOverlay;
