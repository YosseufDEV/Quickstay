import type { ReactRef } from "@gsap/react";
import gsap from "gsap";

const ANIMATION_DURATION = 0.3;

export const animateBackdrop = () => {
    const tl = gsap.timeline({ defaults: { duration: 0.1 } });

    tl.fromTo(".backdrop", {
        opacity: 0,
    }, {
        opacity: 1,
    }).to(".backdrop > *", {
        opacity: 1,
        duration: 0,
    }, "<")
}

export const showFormAnimation = (ref: ReactRef) => {
    const tl = gsap.timeline({ defaults: { duration: ANIMATION_DURATION } });

    tl.fromTo(ref.current, {
        opacity: 0,
        top: "70px",
        translateY: "-30px",
    }, {
        opacity: 1,
        scale: 1,
        top: "auto",
        translateY: "0px",
    })
}
