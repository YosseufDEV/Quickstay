import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface SkeletonProps {
    className?: string;
    count?: number;
    widths?: number[];
}

const Skeleton = ({ className, count=1, widths=[] }: SkeletonProps) => {
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
        if(widths.length < i) {
            widths.push(0);
        }

        skeletons.push(<div key={i} style={{ width: widths[i] ? `${widths[i]}px` : "100%" }} className={`${className ?? ""} skeleton animate-pulse w-full bg-gray-200 rounded-md`}/>);
    }

    return skeletons;

}

export default Skeleton;
