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

export { login }
