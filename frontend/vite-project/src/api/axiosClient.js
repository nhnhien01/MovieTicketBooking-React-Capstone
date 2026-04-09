import axios from "axios";

const axiosClient = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://127.0.0.1:5001/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  // Lấy token từ localStorage (accessToken)
  const token = localStorage.getItem("accessToken"); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;