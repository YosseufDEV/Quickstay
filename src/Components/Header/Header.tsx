import { createContext, useRef } from 'react';
import { useGSAP } from "@gsap/react";

import gsap from 'gsap';

import Logo from '../Logo/Logo';
import HeaderNavigationButton from '../HeaderNavigationButton/HeaderNavigationButton';
import SearchIcon from '../../assets/searchIcon.svg?react';

import styles from './Header.module.css';
import LoginButton from '../LoginButton/LoginButton';
import HeaderIcon from '../HeaderIcon/HeaderIcon';
import { animateHeaderTransition } from '../../animations/HeaderAnimations';

export const HeaderContext = createContext({ flipped: false });

const Header = ({ flipped=false }) => {
    const ref = useRef(null);

    useGSAP(() => {
        animateHeaderTransition(ref, flipped)
    }, [flipped])

    return (
        <div ref={ref} className={styles.header}>
            <div className="logo">
                <Logo />
            </div>
            <div className="nav-buttons flex flex-row gap-7.5 m-auto" style={{ color: "red!" }}>
                <HeaderNavigationButton  to="/" text="Home" />
                <HeaderNavigationButton to="/" text="Hotels" />
                <HeaderNavigationButton to="/" text="Experience" />
                <HeaderNavigationButton to="/" text="About" />
            </div>
            <div className="flex flex-row gap-7.5 h-max items-center justify-center">
                <div className="header-icons">
                    <HeaderIcon Icon={SearchIcon} />
                </div>
                <LoginButton />
            </div>
        </div>
    )
}

export default Header;
