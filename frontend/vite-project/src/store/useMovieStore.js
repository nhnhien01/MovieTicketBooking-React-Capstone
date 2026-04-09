import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { toast } from "sonner";

const cleanId = (id) => (typeof id === "string" ? id.replace(/:/g, "").trim() : id);

export const useMovieStore = create((set, get) => ({
  movies: [],
  loading: false,
  currentMovie: null,

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

  updateMovie: async (id, updatedData) => {
    const safeId = cleanId(id);
    set({ loading: true });
    try {
      // SỬA NHẸ Ở ĐÂY: 
      // Loại bỏ thêm trường 'language' (nếu có) để tránh xung đột với Mongoose Index 
      // mà mình đã xử lý ở backend.
      const { _id, createdAt, updatedAt, __v, language, ...finalData } = updatedData;

      const res = await axiosClient.put(`/movies/${safeId}`, finalData);
      
      set((state) => ({
        movies: state.movies.map((m) => (m._id === safeId ? res.data : m)),
        loading: false
      }));
      
      toast.success("Cập nhật thông tin phim thành công! ✨");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Lỗi dữ liệu";
      toast.error(`Lỗi: ${errorMsg}`);
      return { success: false };
    }
  }
}));