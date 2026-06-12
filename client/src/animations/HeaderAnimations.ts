import type { ReactRef } from "@gsap/react";
import gsap from "gsap";

const AnimationDuration = 0.2;
const black = "#2a2a2a";

export const animateHeaderTransition = (headerRef: ReactRef, docked: boolean) => {
    docked ? animateHeaderDockAnimation(headerRef) : animateHeaderScrollAnimation(headerRef);
    flipHeaderColors(docked);
}

const animateHeaderDockAnimation = (headerRef: ReactRef) => {
    const timeline = gsap.timeline({ defaults: { duration: AnimationDuration } });

    timeline.to(headerRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        backdropFilter: "none",
        boxShadow: "none", 
        height: "92px",
    })
}

const headerThemeConfig = {
    scrolled: {
        color: "#2a2a2a",
    },
    docked: {
        color: "#fff",
    }
}

export const flipHeaderColors = (docked: boolean) => {
    const timeline = gsap.timeline({ defaults: { duration: AnimationDuration } });

    const color = docked ? headerThemeConfig.docked.color : headerThemeConfig.scrolled.color;

    timeline
        .to('.header-icon path', {
            stroke: color,
        }, "<")
        .to(".logo path", {
            fill: color,
        }, "<")
        .to('.nav-buttons p', {
            color: color,
        }, "<")
        .to('.nav-buttons span', {
            backgroundColor: color,
        }, "<")
}


const animateHeaderScrollAnimation = (headerRef: ReactRef, flipped=false) => {
    const timeline = gsap.timeline({ defaults: { duration: AnimationDuration }});

    timeline
        .from(headerRef.current, {
            display: "none",
        })
        .to(headerRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            height: "67px",
        }, "<")
        .to('.header-icon path', {
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

