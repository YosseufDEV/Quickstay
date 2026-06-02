import gsap from "gsap";

const translation = 10

export const inputStatusInAnimation = (color: string) => {
    const tl = gsap.timeline({ defaults: { duration: 0.1 } });

    tl.to(".input", {
        borderStyle: "none",
        outline: `1.5px solid ${color}`,
        marginBottom: "10px",
    })
    .fromTo(".status-message", {
        maxHeight: 0,
        opacity: 0,
        translateY: `-${translation}px`,
    }, {
        maxHeight: "fit-content",
        marginBottom: "30px",
        marginTop: "5px",
        opacity: 1,
        translateY: `${translation}px`,
        ease: "power1.inOut",
    }, "<")

    return tl;

}

