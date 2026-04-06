import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient"; 
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Film, RefreshCw, ImageIcon, Settings2, ShieldCheck, Home, XCircle } from "lucide-react";

export default function MovieUpdate() {
  const { id } = useParams();
  const cleanId = id?.startsWith(':') ? id.slice(1) : id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/movies/${cleanId}`);
        const movie = res.data;

        // Chỉ tập trung các field quan trọng
        const fields = ["title", "posterUrl", "bannerUrl", "description", "rating", "duration", "trailerUrl", "status", "releaseDate"];
        fields.forEach(f => {
          if (f === "releaseDate" && movie[f]) {
            setValue(f, movie[f].split("T")[0]);
          } else {
            setValue(f, movie[f] || "");
          }
        });
        
        setValue("genre", Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "");
        setLoading(false);
      } catch (err) {
        toast.error("Không thể tải dữ liệu phim!");
        navigate("/admin/dashboard");
      }
    };
    fetchMovieData();
  }, [cleanId, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      const finalPayload = {
        ...data,
        rating: Number(data.rating),
        duration: Number(data.duration),
        genre: typeof data.genre === 'string' ? data.genre.split(",").map(i => i.trim()) : data.genre,
      };

      await axiosClient.put(`/movies/${cleanId}`, finalPayload);
      toast.success("Cập nhật thành công!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Lỗi khi lưu dữ liệu!");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <RefreshCw className="animate-spin text-amber-500 mb-4" size={40} />
      <p className="font-black uppercase tracking-widest text-[10px]">Đang nạp dữ liệu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <header className="sticky top-0 z-[100] bg-white border-b-2 border-black px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="group flex items-center gap-2">
              <div className="p-2 border-2 border-black bg-white group-hover:bg-cyan-400 shadow-[3px_3px_0_0_black] transition-all"><ArrowLeft size={18} /></div>
              <span className="hidden md:block font-black uppercase text-[10px] tracking-widest">Quản lý</span>
            </Link>
            <Link to="/" className="p-2 border-2 border-black bg-white hover:bg-yellow-400 shadow-[3px_3px_0_0_black] transition-all ml-2"><Home size={18} /></Link>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-2 border-black shadow-[3px_3px_0_0_black]">
                <ShieldCheck size={14} className="text-amber-600" />
                <span className="text-[10px] font-black italic uppercase">ID: {cleanId.slice(-6)}</span>
             </div>
             <Link to="/admin/dashboard" className="group flex items-center gap-2">
               <span className="hidden md:block font-black uppercase text-[10px] tracking-widest text-red-500">Hủy</span>
               <div className="p-2 border-2 border-black bg-white group-hover:bg-red-500 group-hover:text-white shadow-[3px_3px_0_0_black] transition-all"><XCircle size={18} /></div>
             </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <SectionHeader icon={<Film size={16}/>} title="Thông tin phim" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2"><Label label="Tiêu đề" /><input {...register("title")} className="brutalist-input font-black uppercase" /></div>
               <div><Label label="Thể loại (cách nhau bằng dấu phẩy)" /><input {...register("genre")} className="brutalist-input" /></div>
               <div>
                  <Label label="Trạng thái" />
                  <select {...register("status")} className="brutalist-input">
                    <option value="showing">🟢 ĐANG CHIẾU</option>
                    <option value="coming">🟡 SẮP CHIẾU</option>
                  </select>
               </div>
            </div>

            <SectionHeader icon={<ImageIcon size={16}/>} title="Hình ảnh & Trailer" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div><Label label="Poster URL" /><input {...register("posterUrl")} className="brutalist-input text-xs font-mono" /></div>
               <div><Label label="Banner URL" /><input {...register("bannerUrl")} className="brutalist-input text-xs font-mono" /></div>
               <div className="md:col-span-2"><Label label="YouTube Trailer ID" /><input {...register("trailerUrl")} className="brutalist-input" /></div>
            </div>

            <SectionHeader icon={<Settings2 size={16}/>} title="Thông số kỹ thuật" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div><Label label="Rating" /><input type="number" step="0.1" {...register("rating")} className="brutalist-input" /></div>
               <div><Label label="Thời lượng (phút)" /><input type="number" {...register("duration")} className="brutalist-input" /></div>
               <div className="md:col-span-2"><Label label="Ngày khởi chiếu" /><input type="date" {...register("releaseDate")} className="brutalist-input" /></div>
               <div className="md:col-span-4"><Label label="Mô tả nội dung" /><textarea rows="4" {...register("description")} className="brutalist-input py-4 resize-none" /></div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-black hover:bg-emerald-500 text-white font-black py-5 shadow-[8px_8px_0_0_#000] transition-all uppercase tracking-widest active:translate-x-1 active:translate-y-1 active:shadow-none">
              {isSubmitting ? "ĐANG LƯU..." : "XÁC NHẬN CẬP NHẬT"}
            </button>
          </form>
        </motion.div>
      </div>

      <style>{`.brutalist-input { width: 100%; border: 2.5px solid #000; padding: 0.8rem 1.2rem; outline: none; font-weight: 700; transition: 0.2s; border-radius: 0; } .brutalist-input:focus { background: #fffbeb; box-shadow: 4px 4px 0 0 #000; transform: translate(-2px, -2px); }`}</style>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-black text-white border-2 border-black shadow-[2px_2px_0_0_#f59e0b]">{icon}</div>
      <h3 className="text-[11px] font-black uppercase tracking-widest italic">{title}</h3>
      <div className="flex-1 h-[2px] bg-black opacity-10"></div>
    </div>
  );
}

function Label({ label }) {
  return <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>;
}