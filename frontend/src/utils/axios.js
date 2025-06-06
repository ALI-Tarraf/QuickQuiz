import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const BASE_URL = "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("access_token");
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
    if (error.response && error.response.status === 401) {
      // Clear stored tokens (optional, but clean)
      cookies.remove("access_token");

      // Redirect to login page
      window.location.href = "/"; // Adjust path as needed
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
