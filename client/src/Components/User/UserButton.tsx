import UserIcon from "@/assets/userIcon.svg?react";
import UserMenu from "./UserMenu";
import { useState } from "react";

const UserButton = () => {
    const [menuOpened, setMenuOpened] = useState(false);

    window.addEventListener("click", (e) => {
        if (!(e.target as HTMLElement).closest(".header-icon")) {
            setMenuOpened(false);
        }
    })

    return (
        <div className="relative" onClick={() => setMenuOpened(!menuOpened)}>
            <UserIcon className="stroke-red header-icon w-8 h-8 cursor-pointer"/>
            <UserMenu opened={menuOpened}/>
        </div>
    )
}

export default UserButton;

