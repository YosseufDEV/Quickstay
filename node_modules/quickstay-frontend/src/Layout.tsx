import { useState } from "react";

import { Outlet } from "react-router"

import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer";
import AuthenticationForm  from "./Components/AuthenticationForm/AuthenticationForm";

function Layout() {
    const [scrolled, setScrolled] = useState(false);

    window.onscroll = () => {
        setScrolled(window.scrollY > 5);
    }

    return (
        <>
            <AuthenticationForm />
            <Header flipped={scrolled}/>
            <main>
                <Outlet/>
            </main>
            <Footer />
        </>
  )
}

export default Layout
