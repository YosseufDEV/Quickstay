import { Outlet } from "react-router"
import Header from "./Components/Header/Header"
import { useState } from "react";

function App() {
    const [scrolled, setScrolled] = useState(false);

    window.onscroll = () => {
        setScrolled(window.scrollY > 5);
    }

    return (
        <div className="inset-0 absolute pd-0">
            <nav>
                <Header flipped={scrolled}/>
            </nav>
            <Outlet />
        </div>
  )
}

export default App
