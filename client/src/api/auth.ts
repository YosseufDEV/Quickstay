import { AxiosError } from "axios";
import api from "./client";
import useAuthStore from "@/stores/authStore";

const login = async (email: string, password: string) => {
    try {
        const { data } = await api.post("/auth/login", { email, password });
        useAuthStore.getState().setAuthentication(data.user, data.accessToken);
        return data;
    } catch (error) {
        if(error instanceof AxiosError) {
            return error.response;
        }
        return { error: "An unexpected error occurred" };
    }
}

const refreshSession = async () => {
    const authState = useAuthStore.getState();
    try {
        authState.setAuthToken((await api.post("/auth/refresh")).data.accessToken);
        const userData = (await api.get("/auth/me")).data;
        authState.setUser(userData);
        console.log(authState);

        return { user: userData, accessToken: authState.authToken };
    } catch (error) {
        if(error instanceof AxiosError) {
            return error.response;
        }
    }
}

const getCurrentUser = async () => {
    try {
        const { data } = await api.get("/auth/me");
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        if(error instanceof AxiosError) {
            return error.response;
        }
    }
}

export { login, refreshSession, getCurrentUser }
