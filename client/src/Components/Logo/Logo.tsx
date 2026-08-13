import { useNavigate } from "react-router"
import LogoSrc from "../../assets/logo.svg?react"

const Logo = () => {
    const navigate = useNavigate();
    return (
        <LogoSrc onClick={ () => navigate("/") } className="h-9 logo cursor-pointer" />
    )
}

export default Logo
