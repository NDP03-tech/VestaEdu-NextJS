import axios from "axios";
import config from "../config";

const apiClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((request) => {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if (request.headers) {
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      delete request.headers.Authorization;
    }
  }
  return request;
});

let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (
      error.response?.status !== 401 ||
      request?._retry ||
      request?.url?.includes("/api/refresh")
    ) {
      return Promise.reject(error);
    }
    const refreshToken =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;
    if (!refreshToken) return Promise.reject(error);

    request._retry = true;
    refreshPromise =
      refreshPromise ||
      apiClient
        .post("/api/refresh", { refreshToken })
        .then((response) => {
          const accessToken =
            response.data?.data?.accessToken ?? response.data?.accessToken;
          if (!accessToken) {
            throw new Error("Token refresh response did not include an access token");
          }
          localStorage.setItem("token", accessToken);
        })
        .catch((refreshError) => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    await refreshPromise;
    return apiClient(request);
  },
);

export default apiClient;
