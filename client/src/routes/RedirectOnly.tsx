import { Navigate, useLocation } from "react-router";

const RedirectOnly = ({ children }) => {
    const location = useLocation();
    const { fromRedirect } = location.state || {};

    if (!fromRedirect) {
        return <Navigate to="/" replace />;
    }
    return children
}

export default RedirectOnly;
