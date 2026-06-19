import { useRef, useState } from "react"

import { NavLink } from "react-router"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import styles from "./HeaderNavigationButton.module.css"

interface HeaderNavigationButtonProps {
    to: string,
    text: string,
}

const HeaderNavigationButton = (props: HeaderNavigationButtonProps) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { duration: 0.3 } });
        if(hovered) { 
            tl.to(".underline", {
                width: "100%",
                ease: "power2.out",
            })
        } else {
            tl.to(".underline", {
                width: "0%",
            })
        }

    }, { scope: ref, dependencies: [hovered] })
    return (
        <NavLink onMouseEnter={() => setHovered(true)} 
                 onMouseLeave={() => setHovered(false)}
                 to={{ 
                    pathname: props.to,
                    search: ""
                 }} 
                 ref={ref}
                 className={`decoration-0 header-nav-button ${styles.button}`}>
            <p>{props.text}</p>
            <span className={`${styles.underline} underline`}/>
        </NavLink>
    )
}

export default HeaderNavigationButton;
