import { useEffect } from "react";
import { Outlet, useLocation } from "react-router"

import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer";
import AuthenticationForm  from "./Components/AuthenticationForm/AuthenticationForm";

function Layout() {

    const path = useLocation().pathname;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [path])

    return (
        <>
            <AuthenticationForm />
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer />
        </>
  )
}

export default Layout
