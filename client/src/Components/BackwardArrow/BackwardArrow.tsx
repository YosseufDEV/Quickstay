import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const BackwardArrow = () => {
    const navigate = useNavigate();

    return <ArrowLeft className="stroke-gray-600 w-7 h-7 cursor-pointer" onClick={ () => navigate(-1) }/>
}

export default BackwardArrow;
