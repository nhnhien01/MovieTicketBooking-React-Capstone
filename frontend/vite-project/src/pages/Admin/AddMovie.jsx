import { useForm } from "react-hook-form";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Film, ImageIcon, Settings2, 
  ShieldCheck, Home, X, PlusSquare, Save
} from "lucide-react";

export default function AddMovie() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      status: "showing",
      rating: 0,
      duration: 120,
      durationSeconds: 0,
      ageRating: "P",
      director: ""
    }
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const totalDuration = Number(data.duration) + (Number(data.durationSeconds) / 60);
      const finalPayload = {
        ...data,
        director: data.director || "Đang cập nhật",
        rating: Number(data.rating) || 0,
        duration: Math.round(totalDuration),
        genre: typeof data.genre === 'string' ? data.genre.split(",").map(i => i.trim()).filter(Boolean) : [],
        cast: typeof data.cast === 'string' ? data.cast.split(",").map(i => i.trim()).filter(Boolean) : [],
        movieLanguage: "Tiếng Việt",
      };

      const response = await axiosClient.post("/movies", finalPayload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Thêm phim thành công!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo phim!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-semibold text-xs"
          >
            <ArrowLeft size={16} /> TRỞ VỀ DASHBOARD
          </button>
          <Link to="/" className="text-slate-400 hover:text-amber-600 transition-colors">
            <Home size={20} />
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-200">
            <h1 className="font-extrabold uppercase text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <PlusSquare size={18} className="text-amber-600"/> ĐĂNG KÝ PHIM MỚI
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full border border-amber-200">
               <ShieldCheck size={12} className="text-amber-700" />
               <span className="text-[10px] font-bold text-amber-800 uppercase">Admin Mode</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
            
            {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Film size={14} /> Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Tiêu đề phim</label>
                  <input {...register("title", { required: true })} className="smooth-input font-semibold" placeholder="VÍ DỤ: AVENGERS: ENDGAME" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Đạo diễn</label>
                  <input {...register("director")} className="smooth-input" placeholder="Tên đạo diễn..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Giới hạn độ tuổi</label>
                  <select {...register("ageRating")} className="smooth-input bg-white">
                    <option value="P">P - Mọi lứa tuổi</option>
                    <option value="K">K - Dưới 13 tuổi</option>
                    <option value="T13">C13 - 13 tuổi trở lên</option>
                    <option value="T16">C16 - 16 tuổi trở lên</option>
                    <option value="T18">C18 - 18 tuổi trở lên</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PHẦN 2: MEDIA */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ImageIcon size={14} /> Media & Trailer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-slate-500">Poster URL</label>
                  <input {...register("posterUrl")} className="smooth-input text-xs" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-1 text-slate-500">Banner URL</label>
                  <input {...register("bannerUrl")} className="smooth-input text-xs" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold mb-1 text-slate-500">YouTube Trailer ID</label>
                  <input {...register("trailerUrl")} className="smooth-input" placeholder="dQw4w9WgXcQ" />
                </div>
              </div>
            </div>

            {/* PHẦN 3: THÔNG SỐ */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Settings2 size={14} /> Thông số & Nội dung
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Rating (0-10)</label>
                  <input type="number" step="0.1" {...register("rating")} className="smooth-input text-center font-bold text-amber-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Phút</label>
                  <input type="number" {...register("duration")} className="smooth-input text-center" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Giây</label>
                  <input type="number" max="59" {...register("durationSeconds")} className="smooth-input text-center" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Khởi chiếu</label>
                  <input type="date" {...register("releaseDate")} className="smooth-input text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Thể loại</label>
                  <input {...register("genre")} className="smooth-input" placeholder="Hành động, Hài..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Trạng thái</label>
                  <select {...register("status")} className="smooth-input bg-white">
                    <option value="showing">ĐANG CHIẾU</option>
                    <option value="coming">SẮP CHIẾU</option>
                    <option value="ended">ĐÃ KẾT THÚC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600">Diễn viên</label>
                <input {...register("cast")} className="smooth-input" placeholder="Robert Downey Jr, Chris Evans..." />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600">Mô tả nội dung</label>
                <textarea rows="4" {...register("description")} className="smooth-input resize-none text-sm leading-relaxed" placeholder="Viết mô tả ngắn..." />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:bg-slate-300 shadow-lg shadow-slate-200"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận thêm phim mới"}
              </button>
              <button 
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <style>{`
        .smooth-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 16px;
          outline: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .smooth-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
      `}</style>
    </div>
  );
}