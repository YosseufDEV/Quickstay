import { useEffect, useLayoutEffect, useState } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
    const [userLoading, setUserLoading] = useState(false);

    useLayoutEffect(() => {
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
