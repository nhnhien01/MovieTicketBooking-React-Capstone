import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { toast } from "sonner";

// Hàm helper làm sạch ID để tránh lỗi 400/404
const cleanId = (id) => (typeof id === "string" ? id.replace(/:/g, "").trim() : id);

export const useMovieStore = create((set, get) => ({
  movies: [],
  loading: false,
  currentMovie: null,

  // 1. LẤY TẤT CẢ DANH SÁCH PHIM
  fetchMovies: async () => {
    set({ loading: true });
    try {
      const res = await axiosClient.get("/movies");
      set({ movies: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Không thể tải danh sách phim!");
    }
  },

  // 2. LẤY CHI TIẾT 1 BỘ PHIM
  fetchMovieById: async (id) => {
    const safeId = cleanId(id);
    set({ loading: true });
    try {
      const res = await axiosClient.get(`/movies/${safeId}`);
      set({ currentMovie: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Lỗi khi tải thông tin phim.");
    }
  },

  // 3. THÊM PHIM MỚI
  addMovie: async (movieData) => {
    set({ loading: true });
    try {
      const res = await axiosClient.post("/movies", movieData);
      set((state) => ({ 
        movies: [res.data, ...state.movies], 
        loading: false 
      }));
      toast.success("Đã thêm phim mới thành công!");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Lỗi khi thêm phim.");
      return { success: false };
    }
  },

  // 4. XÓA PHIM
  deleteMovie: async (id) => {
    const safeId = cleanId(id);
    try {
      await axiosClient.delete(`/movies/${safeId}`);
      set((state) => ({
        movies: state.movies.filter((m) => m._id !== safeId)
      }));
      toast.success("Đã xóa phim khỏi hệ thống.");
    } catch (error) {
      toast.error("Không thể xóa phim này.");
    }
  },

  // 5. CẬP NHẬT PHIM (FIX LỖI 400 TẠI ĐÂY)
  updateMovie: async (id, updatedData) => {
    const safeId = cleanId(id);
    set({ loading: true });
    try {
      // LOẠI BỎ CÁC TRƯỜNG HỆ THỐNG TRƯỚC KHI GỬI
      const { _id, createdAt, updatedAt, __v, ...finalData } = updatedData;

      const res = await axiosClient.put(`/movies/${safeId}`, finalData);
      
      set((state) => ({
        movies: state.movies.map((m) => (m._id === safeId ? res.data : m)),
        loading: false
      }));
      
      toast.success("Cập nhật thông tin phim thành công! ✨");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      // Hiển thị chi tiết lỗi từ Backend trả về
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Lỗi dữ liệu";
      toast.error(`Lỗi: ${errorMsg}`);
      console.error("Lỗi Store Update:", error.response?.data);
      return { success: false };
    }
  }
}));