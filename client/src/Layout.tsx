import { useState } from "react";

import { Outlet } from "react-router"

import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer";
import AuthenticationForm  from "./Components/AuthenticationForm/AuthenticationForm";

function Layout() {
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
