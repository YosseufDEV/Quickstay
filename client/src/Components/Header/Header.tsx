import { useEffect, useRef, useState } from 'react';

import { useGSAP } from "@gsap/react";
import { useLocation } from 'react-router';

import SearchIcon from '../../assets/searchIcon.svg?react';

import Logo from '../Logo/Logo';
import HeaderNavigationButton from '../HeaderNavigationButton/HeaderNavigationButton';
import GenericButton from '../GenericButton/GenericButton';
import UserIcon from '../../assets/userIcon.svg?react';

import { animateHeaderTransition, flipHeaderColors } from '../../animations/HeaderAnimations';

import styles from './Header.module.css';
import useAuthModalStore from '@/stores/authModalStore';
import useAuthStore from '@/stores/authStore';
import { logout } from '@/api/auth';

const Header = () => {
    const atHome = useLocation().pathname == "/";   
    const [docked, setDocked] = useState(atHome ? window.scrollY < 5 : false);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    window.onscroll = () => {
        setDocked((atHome ? window.scrollY < 5 : false));
    }

    const ref = useRef(null);
    const openModal = useAuthModalStore(state => state.openModal);

    const iconColor = docked ? "primaryText" : "contrastText";

    const handleLoginButtonClick = () => {
        openModal();
    }

    useEffect(() => {
        setDocked(atHome ? window.scrollY < 5 : false);
    }, [atHome])

    // TODO: this is a bit hacky, find a better way to trigger the color flip animation on login/logout, maybe by using a context or something
    useEffect(() => {
        if(ref.current) {
            flipHeaderColors(docked);
        }
    }, [isAuthenticated])

    useGSAP(() => {
        animateHeaderTransition(ref, docked)
    }, [docked, atHome])

    return (
        <header ref={ref} className={styles.header}>
            <div className="logo">
                <Logo />
            </div>
            <div className="nav-buttons flex flex-row gap-7.5 m-auto" style={{ color: "red!" }}>
                <HeaderNavigationButton  to="/" text="Home" />
                <HeaderNavigationButton to="/hotels" text="Hotels" />
                <HeaderNavigationButton to="/" text="Experience" />
                <HeaderNavigationButton to="/" text="About" />
            </div>
            <div className={ `flex flex-row gap-7.5 h-max items-center justify-center` }>
                <SearchIcon className="header-icon w-8 h-8 cursor-pointer"/>
                {isAuthenticated ? <UserIcon onClick={() => { console.log(useAuthStore.getState().user); logout() }} className="stroke-red header-icon w-8 h-8 cursor-pointer"/> : <GenericButton onClick={handleLoginButtonClick} text="Login" className="rounded-[35px]! w-25 bg-black! text-white! outline-none! text-[17px]!"/> }
            </div>
        </header>
    )
}

export default Header;
