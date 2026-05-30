import type { ReactRef } from "@gsap/react";
import gsap from "gsap";

const HEADER_EXPANSION_DURATION = 0.3;
const HEADER_ANIMATION_DELAY = 0.1;
const black = "#2a2a2a";

export const animateHeaderTransition = (headerRef: ReactRef, flipped=false) => {
    flipped ? animateHeaderExpansion(headerRef, flipped) : animateHeaderCollapse(headerRef);
    flipHeaderColors(flipped);
}

const animateHeaderCollapse = (headerRef: ReactRef) => {
    const timeline = gsap.timeline({ defaults: { duration: HEADER_EXPANSION_DURATION, delay: HEADER_ANIMATION_DELAY } });
    timeline.to(headerRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        backdropFilter: "none",
        boxShadow: "none", 
        height: "92px",
    })
}

export const flipHeaderColors = (flipped: boolean) => {
    const timeline = gsap.timeline({ defaults: { duration: HEADER_EXPANSION_DURATION-0.05 } });
    timeline
        .to('.header-icons path', {
            stroke: flipped ? black : "white",
        }, "<")
        .to(".logo path", {
            fill: flipped ? black : "white",
        }, "<")
        .to('.nav-buttons p', {
            color: flipped ? black : "white",
        }, "<")
        .to('.nav-buttons span', {
            backgroundColor: flipped ? black : "white",
        }, "<")
}


const animateHeaderExpansion = (headerRef: ReactRef, flipped=false) => {
    const timeline = gsap.timeline({ defaults: { duration: HEADER_EXPANSION_DURATION }});

    timeline
        .to(headerRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(15px)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            height: "67px",
        }, "<")
        .to('.header-icons path', {
            stroke: flipped ? black : "white",
        }, "<")
        .to(".logo path", {
            fill: flipped ? black : "white",
        }, "<")
        .to('.nav-buttons p', {
            color: flipped ? black : "white",
        }, "<")
        .to('.nav-buttons span', {
            backgroundColor: flipped ? black : "white",
        }, "<")
}
