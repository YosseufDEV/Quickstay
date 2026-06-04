import gsap from "gsap";

const translation = 10
const duration = 0.1;

export const inputValidityChangeAnimation = (color: string, debug?: boolean) => {
    const tl = gsap.timeline({ defaults: { duration: debug ? 10 : duration } });
    tl.to(".input", {    
        borderStyle: "none",
        outline: `1.5px solid ${color}`,
        marginBottom: "2vh",
    })
    return tl;
}

export const inputStatusInAnimation = (debug?: boolean) => {
    const tl = gsap.timeline({ defaults: { duration: debug ? 10 : duration } });

    tl.fromTo(".status-message", {
        maxHeight: 0,
        autoAlpha: 0,
        translateY: `-${translation}px`,
    }, {
        maxHeight: "fit-content",
        marginBottom: "3.5vh",
        marginTop: "1vh",
        autoAlpha: 1,
        translateY: `${translation}px`,
        ease: "power1.inOut",
    }, "<")

    return tl;

}


export const inputStatusOutAnimation = (debug?: boolean) => {
    const tl = gsap.timeline({ defaults: { duration: debug ? 10 : duration } });

    tl.fromTo(".status-message", {
        maxHeight: "fit-content",
        marginBottom: "3.5vh",
        marginTop: "1vh",
        autoAlpha: 1,
        translateY: `${translation}px`,
        ease: "power1.inOut",
    }, {
        maxHeight: 0,
        autoAlpha: 0,
        marginBottom: "0",
        marginTop: "0",
        translateY: `-${translation}px`,
    }, "<")

    return tl;

}

