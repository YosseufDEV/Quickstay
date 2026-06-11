import { useEffect } from "react"

import Layout from "./Layout"
import { getCurrentUser } from "./api/auth"
import useAuthStore from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
    useEffect(() => {

        getCurrentUser().then((res) => {
            if(res.success) {
                useAuthStore.getState().setUser(res.payload.user);
            } 
        })

    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Layout />
        </QueryClientProvider>
    )
}

export default App
