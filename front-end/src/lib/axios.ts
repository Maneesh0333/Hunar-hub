import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStore.js";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}


// Request interceptor: attach access token automatically
axiosApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

axiosApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login") // <--- skip login
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axiosApi
            .post("/auth/refresh-token")
            .then((res) => {
              const newToken = res.data.accessToken;
              useAuthStore.getState().setAccessToken(newToken);
              return newToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosApi(originalRequest);
      } catch (err) {
        if (useAuthStore.getState().accessToken) {
          useAuthStore.getState().logout();
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosApi;
