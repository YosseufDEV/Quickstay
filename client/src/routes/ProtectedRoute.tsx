import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return children;
}

export default ProtectedRoute;
