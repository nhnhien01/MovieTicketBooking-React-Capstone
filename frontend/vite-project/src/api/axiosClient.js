import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  // Sửa từ "token" thành "accessToken" cho khớp với useAuthStore
  const token = localStorage.getItem("accessToken"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;