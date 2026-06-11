import { useEffect } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";

const App = () => {
    useEffect(() => {
        getCurrentUser().then((res) => {
            if(res.status == 400 || res.status == 401) {
                console.log(res.message); 
            }

            const { payload } = res;
            if(payload.user) {
                useAuthStore.getState().setUser(payload.user);
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
