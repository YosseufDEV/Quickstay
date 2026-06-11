import { useEffect } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";

const App = () => {
    useEffect(() => {

        getCurrentUser().then((res) => {
            if(res.success) {
                useAuthStore.getState().setUser(res.payload.user);
            } 
        })

    }, []);

    return (
        <Layout />
    )
}

export default App
