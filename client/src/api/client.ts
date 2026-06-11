import useAuthStore from "@/stores/authStore";
import axios, { Axios, AxiosError, type InternalAxiosRequestConfig } from "axios";

axios.defaults.withCredentials = true;

let refreshing = false;
let requestQueue: Array<{ resolve: (value: unknown) => void, reject: (reason?: any) => void, config: InternalAxiosRequestConfig }> = [];

type ProcessRequestParameters = {
    error: any;
    token?: never;
} | { error?: never; token: string };

const processRequests = (params: ProcessRequestParameters) => {
    requestQueue.forEach(({ resolve, reject }) => {
        params.error ? reject(params.error) : resolve(params.token);
    });
    requestQueue = [];
}

const api = axios.create({
    baseURL: "http://localhost:5050",
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

        if (error.response.status !== 401 || (originalRequest._retry) || originalRequest.url === "/auth/login") {
            return Promise.reject(error);
        }

        if(refreshing) {
            return new Promise((resolve, reject) => {
                requestQueue.push({ resolve, reject, config: originalRequest });
            }).then((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
            });
        }

        originalRequest._retry = true;
        refreshing = true;

        return await axios.post("http://localhost:5050/auth/refresh").then(res => {
            const { payload } = res.data;
            useAuthStore.getState().setAuthToken(payload.accessToken);

            processRequests({ token: payload.accessToken }); 
            return api(originalRequest);
        }).catch((error: AxiosError) => {

            useAuthStore.getState().logout();

            processRequests({ error: error.response }); 

            console.log("Response:::", error.response);

            return Promise.reject(error.response);
        }).finally(() => refreshing = false)

    })

export default api;

