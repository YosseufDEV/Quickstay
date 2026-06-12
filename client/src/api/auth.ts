import { AxiosError, type AxiosResponse } from "axios";
import api from "./client";
import useAuthStore from "@/stores/authStore";
import type { IUser } from "@quickstay/types/User.ts";

type Response = {
    success: true;
    payload?: any;
    message?: never;
} | {
    success: false;
    payload?: never;
    message?: string;
}

const login = async (email: string, password: string) => {
    return await api.post("/auth/login", { email, password }).then(res => {
        const { payload } = res.data;

        useAuthStore.getState().setAuthentication(payload.user, payload.accessToken);

        return { success: true, payload };
    }).catch((error: AxiosError) => {
        const res = error.response as AxiosResponse;

        if(res.status !== 200) {
            return { success: false, message: res.data.message || "Login failed" };
        }
    })
}

const registerUser = async (user: IUser): Promise<Response> => {
    const { firstName, lastName, email, password, country } = user;
    return await api.post("/auth/register", { firstName, lastName, email, password, country }).then((res: AxiosResponse) => {
        const { payload } = res.data;
        return { success: true, payload };
    }).catch((error: AxiosError) => {
        const res = error.response as AxiosResponse;
        return { success: false, message: res.data.message || "Registration failed" };
    })
}

const refreshSession = async () => {
    const authState = useAuthStore.getState();
    try {
        const { payload } = (await api.post("/auth/refresh") ).data;
        authState.setAuthToken(payload.accessToken);

        const userData = (await api.get("/auth/me")).data;
        authState.setUser(userData);

        return { user: userData, accessToken: authState.authToken };
    } catch (error) {
        if(error instanceof AxiosError) {
            return error.response;
        }
    }
}

const getCurrentUser = async (): Promise<Response> => {
    return await api.get("/auth/me").then(res => {
        const { payload } = res.data;
        return { success: true, payload };
    }).catch((error: AxiosError) => {
        const res: AxiosError & { payload: any, message: string } = error.response as any;
        return { success: false, message: res?.message || "Failed to fetch user data" };
    })
}

const logout = async () => {
    try {
        await api.post("/auth/logout");
        useAuthStore.getState().logout();
    } catch(error) {
        console.log(error);
    }
}

export { login, registerUser, refreshSession, getCurrentUser, logout }
