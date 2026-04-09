import { create } from "zustand";
// Đổi dòng này từ "axios" sang "axiosClient" của bạn
import axiosClient from "../api/axiosClient"; 

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  
  fetchUsers: async () => {
    set({ loading: true });
    try {
      // Dùng axiosClient thay vì axios
      const res = await axiosClient.get("/users/all"); 
      
      console.log("Dữ liệu thực tế:", res.data);

      // Lưu ý cấu trúc res.data tùy thuộc vào backend trả về {users: []} hay chỉ []
      const userData = res.data.users || res.data.data || (Array.isArray(res.data) ? res.data : []);
      
      set({ users: userData, loading: false });
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
      set({ loading: false, users: [] });
    }
  },

  deleteUser: async (id) => {
    try {
      // Dùng axiosClient
      const res = await axiosClient.delete(`/users/${id}`);
      if (res.data.success) {
        set((state) => ({ 
          users: state.users.filter(user => user._id !== id) 
        }));
        alert("Xóa thành công!");
      }
    } catch (error) {
      alert("Không thể xóa: " + (error.response?.data?.message || "Lỗi kết nối"));
    }
  }
}));