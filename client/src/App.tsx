import { useLayoutEffect } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";

const App = () => {
    useLayoutEffect(() => {
        getCurrentUser().then((response) => {;
            useAuthStore.getState().setUser(response.data);
        }).catch((error) => {
            console.error("Failed to fetch current user:", error);
        });
    });

    return (
        <Layout />
    )
}

export default App
