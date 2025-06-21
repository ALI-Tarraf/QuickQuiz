import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response?.data?.message === "Unauthenticated."
    ) {
      localStorage.removeItem("access_token");
      sessionStorage.clear();

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
