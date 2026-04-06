import { create } from "zustand";
import axiosClient from "../api/axiosClient"; 

export const useUserStore = create((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
  set({ loading: true });
  try {
    const res = await axiosClient.get("/users");
    console.log("Check data nè:", res); // Dòng này quan trọng nhất, mở F12 xem nó ra cái gì

    // Thử các trường hợp bọc dữ liệu của Backend
    const userData = res.data?.users || res.users || res.data || res || [];
    
    set({ 
      users: Array.isArray(userData) ? userData : [], 
      loading: false 
    });
  } catch (error) {
    console.error("Lỗi fetchUsers:", error);
    set({ loading: false, users: [] });
  }
},

  deleteUser: async (userId) => {
    try {
      await axiosClient.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => (user._id || user.id) !== userId),
      }));
    } catch (error) {
      console.error("Lỗi xóa user:", error);
    }
  },
}));