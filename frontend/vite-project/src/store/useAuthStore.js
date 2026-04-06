import { create } from "zustand";
import axiosClient from "../api/axiosClient";

export const useAuthStore = create((set) => ({
  // Khởi tạo data từ localStorage
  authUser: JSON.parse(localStorage.getItem("user")) || null,
  isCheckingAuth: true, // Mặc định là đang check khi mới load app

  checkAuth: async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      const userData = res.data.user;
      set({ authUser: userData, isCheckingAuth: false });
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.log("Error in checkAuth:", error);
      // Nếu lỗi (401 chẳng hạn), xóa sạch để tránh "đăng nhập ảo"
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  signIn: async (data) => {
    try {
      const res = await axiosClient.post("/auth/signin", data);
      if (res.data.success) {
        // LƯU CẢ 2 VÀO LOCALSTORAGE
        localStorage.setItem("accessToken", res.data.accessToken); 
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
        
        set({ authUser: res.data.user });
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Đăng nhập thất bại" 
      };
    }
  },

  signUp: async (data) => {
    try {
      const res = await axiosClient.post("/auth/signup", data);
      return { success: true, message: res.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Đăng ký thất bại" 
      };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    set({ authUser: null });
    // Dùng navigate tốt hơn là reload trang, nhưng nếu muốn sạch hoàn toàn thì:
    window.location.href = "/login";
  },
}));