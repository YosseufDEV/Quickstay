import gsap from "gsap";

export const inputStatusChangeAnimation = (color: string) => {
    const tl = gsap.timeline({ defaults: { duration: 0.2 } });
    const translation = 10

    tl.to(".input", {
        border: `1.5px solid ${color}`,
    })
    .to(".status-message", { marginBottom: "20px" }, "<") .fromTo(".status-message", {
        opacity: 0,
        translateY: `-${translation}px`,
    }, {
        opacity: 1,
        translateY: `${translation}px`,
        delay: 0.05,
    }, "<")

    return tl;

}
