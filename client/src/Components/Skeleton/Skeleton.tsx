import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface SkeletonProps {
    className?: string;
    count?: number;
    orientation?: "horizontal" | "vertical";
    widths?: number[];
    heights?: number[];
    height?: number;
    gap?: number;
    containerClassName?: string;
}

// TODO: Sync animation.
const Skeleton = ({ containerClassName="", className="", height=25, count=1, widths=[], heights=[], orientation, gap=15 }: SkeletonProps) => {
    const skeletons = [];

    // TODO: Signular useGSAP hook to animate the skeletons with a pulsing effect
    // useGSAP(() => {
    //     gsap.fromTo(".skeleton", 
    //     {
    //         background: "linear-gradient(to right, #e0e0e0 0%, #adadad, #adadad, #e0e0e0 100%)",
    //         backgroundSize: "200%",
    //         backgroundPosition: "100%",
    //     },
    //     {
    //         backgroundSize: "200%",
    //         backgroundPosition: "-102%",   
    //         duration: 1,
    //         repeat: -1,
    //     });
    //     console.log("Skeleton animation initialized");
    // });

    for (let i = 0; i < count; i++) {
        if(widths?.length < i) {
            widths.push(0);
        }

        if(heights?.length > i) {
            height = 0;
        }

        // TODO: FIX THIS FUCKING SHIT
        skeletons.push(<div key={i} style={{ width: widths[i] ? `${widths[i]}px` : "100%", height: heights[i] ? `${heights[i]}px` : `${height}px` }} className={`${className} skeleton animate-pulse w-full bg-gray-200 rounded-md`}/>);
    }

    if(skeletons.length === 1) {
        return skeletons;
    }

    return (
        <div style={{ display: "flex", gap: `${gap}px`, flexDirection: orientation === "horizontal" ? "row" : "column" }} className={`${containerClassName} skeleton-container`}>
            { skeletons }
        </div>
    )

}

export default Skeleton;
