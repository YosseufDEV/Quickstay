import { useRef } from 'react';
import { useGSAP } from "@gsap/react";

import SearchIcon from '../../assets/searchIcon.svg?react';

import Logo from '../Logo/Logo';
import HeaderNavigationButton from '../HeaderNavigationButton/HeaderNavigationButton';
import GenericButton from '../GenericButton/GenericButton';

import { animateHeaderTransition } from '../../animations/HeaderAnimations';

import styles from './Header.module.css';
import useAuthModalStore from '@/stores/authModalStore';

const Header = ({ flipped=false }) => {
    const ref = useRef(null);
    const openModal = useAuthModalStore(state => state.openModal);

    const handleLoginButtonClick = () => {
        openModal();
    }

    useGSAP(() => {
        animateHeaderTransition(ref, flipped)
    }, [flipped])

    return (
        <header ref={ref} className={styles.header}>
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
                <div className="header-icons flex flex-row gap-8">
                    <SearchIcon className="w-8 h-8 cursor-pointer"/>
                </div>
                <GenericButton onClick={handleLoginButtonClick} text="Login" className="rounded-[35px]! w-25 bg-black! text-white! outline-none! text-[17px]!"/>
            </div>
        </header>
    )
}

export default Header;
