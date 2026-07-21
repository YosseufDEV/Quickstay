import { useEffect, useState } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
    const [userLoading, setUserLoading] = useState(true);

    // INFO: This to ensure that the user is fetched before rendering the app, preventing flickering of the UI when the user state is not yet available.
    useEffect(() => {
        console.log("Fetching current user...");
        setUserLoading(true);
        getCurrentUser().then((res) => {
            if(res.success) {
                console.log("Current user fetched successfully:", res.payload.user);
                useAuthStore.getState().setUser(res.payload.user);
            } 
        }).finally(() => setUserLoading(false));

    }, []);

    if(!userLoading) {
        return (
            <QueryClientProvider client={queryClient}>
                <Layout />
            </QueryClientProvider>
        )
    }
}

export default App
