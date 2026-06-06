import { useEffect } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";

const App = () => {
    useEffect(() => {
        getCurrentUser().then((user) => {;
            if(user.user) {
                useAuthStore.getState().setUser(user);
            }
        }).catch((error) => {
            console.error("Failed to fetch current user:", error);
        });
    }, []);

    return (
        <Layout />
    )
}

export default App
