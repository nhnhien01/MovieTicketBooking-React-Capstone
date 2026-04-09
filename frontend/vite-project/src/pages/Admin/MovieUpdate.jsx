import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  ArrowLeft, RefreshCw, Save, X, Clapperboard, 
  Film, ImageIcon, Settings2, Home, Users 
} from "lucide-react";

export default function MovieUpdate() {
  const { id } = useParams();
  const cleanId = id?.startsWith(":") ? id.slice(1) : id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();

  const watchPoster = watch("posterUrl");
  const watchBanner = watch("bannerUrl");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await axiosClient.get(`/movies/${cleanId}`);
        const movie = res.data;
        
        const fields = ["title", "posterUrl", "bannerUrl", "description", "rating", "trailerUrl", "status", "releaseDate", "director", "ageRating"];
        fields.forEach((f) => {
          if (f === "releaseDate" && movie[f]) {
            setValue(f, movie[f].split("T")[0]);
          } else {
            setValue(f, movie[f] || "");
          }
        });

        if (movie.duration) {
          const mins = Math.floor(movie.duration);
          const secs = Math.round((movie.duration - mins) * 60);
          setValue("duration", mins);
          setValue("durationSeconds", secs || 0);
        }

        // Xử lý Array cho Thể loại và Diễn viên
        setValue("genre", Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "");
        setValue("cast", Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast || "");
        
        setLoading(false);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu!");
        navigate("/admin/dashboard");
      }
    };
    fetchMovieData();
  }, [cleanId, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      const totalDuration = Number(data.duration) + (Number(data.durationSeconds || 0) / 60);
      const finalPayload = {
        ...data,
        rating: Number(data.rating),
        duration: Math.round(totalDuration),
        genre: typeof data.genre === "string" ? data.genre.split(",").map((i) => i.trim()).filter(Boolean) : data.genre,
        cast: typeof data.cast === "string" ? data.cast.split(",").map((i) => i.trim()).filter(Boolean) : data.cast,
      };
      await axiosClient.put(`/movies/${cleanId}`, finalPayload);
      toast.success("Cập nhật thành công!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Lỗi khi lưu!");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-amber-500" size={32} />
    </div>
  );

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
              <Clapperboard size={18} className="text-amber-600"/> CẬP NHẬT PHIM <span className="text-slate-400 font-normal">#{cleanId.slice(-6)}</span>
            </h1>
            <button onClick={() => navigate("/admin/dashboard")} className="text-slate-400 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
            
            {/* PHẦN 1: THÔNG TIN CHI TIẾT */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Film size={14} /> Thông tin chi tiết
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Tên phim</label>
                  <input {...register("title")} className="smooth-input font-semibold" placeholder="Nhập tên phim..." />
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

            {/* PHẦN 2: MEDIA PREVIEW */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ImageIcon size={14} /> Media Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold mb-1 text-slate-500">Poster URL</label>
                    <input {...register("posterUrl")} className="smooth-input text-xs" />
                  </div>
                  <div className="w-12 h-16 rounded border bg-white overflow-hidden shrink-0 mt-5 shadow-sm">
                    {watchPoster ? <img src={watchPoster} className="w-full h-full object-cover" alt="poster" /> : <div className="w-full h-full bg-slate-100" />}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold mb-1 text-slate-500">Banner URL</label>
                    <input {...register("bannerUrl")} className="smooth-input text-xs" />
                  </div>
                  <div className="w-16 h-12 rounded border bg-white overflow-hidden shrink-0 mt-5 shadow-sm">
                    {watchBanner ? <img src={watchBanner} className="w-full h-full object-cover" alt="banner" /> : <div className="w-full h-full bg-slate-100" />}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold mb-1 text-slate-500">YouTube Trailer ID</label>
                  <input {...register("trailerUrl")} className="smooth-input text-xs" placeholder="Ví dụ: dQw4w9WgXcQ" />
                </div>
              </div>
            </div>

            {/* PHẦN 3: THÔNG SỐ & NỘI DUNG */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Settings2 size={14} /> Thông số & Nội dung
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Rating</label>
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
                  <label className="block text-xs font-bold mb-1.5 text-slate-600">Thể loại (cách nhau bằng dấu phẩy)</label>
                  <input {...register("genre")} className="smooth-input" placeholder="Hành động, Phiêu lưu..." />
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

              {/* CỘT DIỄN VIÊN ĐÃ ĐƯỢC THÊM LẠI */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600 flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400"/> Diễn viên 
                </label>
                <input 
                  {...register("cast")} 
                  className="smooth-input" 
                  placeholder="Ví dụ: Tom Holland, Zendaya, Benedict Cumberbatch..." 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-600">Mô tả tóm tắt</label>
                <textarea 
                  rows="4" 
                  {...register("description")} 
                  className="smooth-input resize-none text-sm leading-relaxed" 
                  placeholder="Nhập nội dung phim..."
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-500 text-amber-950 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18} />}
                CẬP NHẬT DỮ LIỆU
              </button>
              <button 
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                HỦY
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
        .smooth-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}