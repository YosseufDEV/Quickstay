import { useEffect, useState } from "react";

export function useHover(ref: React.RefObject<any>) {
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if(ref) {
            const element = ref.current;
            element.addEventListener("mouseenter", () => setHovered(true));
            element.addEventListener("mouseleave", () => setHovered(false));
        }
    }, [ref])

    return hovered;

}
