import axios from "axios";

let isHandlingUnauthorized = false;

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type" : "application/json"
    },
});


axiosClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("jwt");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const hasToken = Boolean(localStorage.getItem("token"));

        if (status === 401 && hasToken && !isHandlingUnauthorized) {
            isHandlingUnauthorized = true;

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.replace("/login");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;