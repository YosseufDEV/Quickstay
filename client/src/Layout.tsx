import { useState } from "react";

import { Outlet } from "react-router"

import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer";

function Layout() {
    const [scrolled, setScrolled] = useState(false);

    window.onscroll = () => {
        setScrolled(window.scrollY > 5);
    }

    return (
        <div className="pd-0 p-0 flex flex-col">
            <Header flipped={scrolled}/>
            <Outlet/>
            <Footer />
        </div>
  )
}

export default Layout
