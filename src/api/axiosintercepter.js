import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "/api/v1/",
  baseURL: "http://localhost:3300/api/v1/",
  // baseURL: "https://counseling-str5.onrender.com/api/v1/",
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
