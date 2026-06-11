import { useState } from "react";

import { Outlet, ScrollRestoration } from "react-router"

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
            <ScrollRestoration />
        </>
  )
}

export default Layout
