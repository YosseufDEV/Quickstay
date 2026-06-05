import useAuthStore from "@/stores/authStore";
import axios, { type InternalAxiosRequestConfig } from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: "http://localhost:5050",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().authToken;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

api.interceptors.response.use(
    response => response, 
    async error => {
        const originalRequest: InternalAxiosRequestConfig & { _retry: boolean } = error.config;

        if (error.response.status === 401 && !(originalRequest._retry)) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post("http://localhost:5050/auth/refresh", { withCredentials: true });

                console.log("Token refreshed:", data.accessToken);
                useAuthStore.getState().setAuthToken(data.accessToken);

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    })

export default api;

