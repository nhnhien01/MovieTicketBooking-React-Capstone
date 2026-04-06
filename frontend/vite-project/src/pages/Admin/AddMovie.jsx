import { useForm } from "react-hook-form";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Film, ImageIcon, Settings2, 
  ShieldCheck, Home, XCircle, PlusSquare 
} from "lucide-react";

export default function AddMovie() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      status: "showing",
      rating: 0,
      duration: 120
    }
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    // 1. Tạo bản sao payload nhưng KHÔNG CÓ trường 'language'
    const { language, ...rest } = data; 

    const finalPayload = {
      ...rest,
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      bannerUrl: data.bannerUrl,
      trailerUrl: data.trailerUrl,
      releaseDate: data.releaseDate,
      status: data.status,
      rating: Number(data.rating) || 0,
      duration: Number(data.duration) || 0,
      genre: typeof data.genre === 'string' ? data.genre.split(",").map(i => i.trim()).filter(Boolean) : [],
      cast: typeof data.cast === 'string' ? data.cast.split(",").map(i => i.trim()).filter(Boolean) : [],
      
      // ĐỔI TÊN Ở ĐÂY:
      movieLanguage: "Tiếng Việt", // Không dùng chữ 'language' nữa
    };

    console.log("Payload thực sự gửi đi:", finalPayload);
    const response = await axiosClient.post("/movies", finalPayload);
    
    if (response.status === 201 || response.status === 200) {
      toast.success("THÀNH CÔNG RỒI!");
      navigate("/admin/dashboard");
    }
  } catch (error) {
    console.log("CHI TIẾT LỖI:", error.response?.data);
    toast.error(error.response?.data?.message || "Vẫn lỗi, xem Console!");
  }
};

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans">
      {/* Header đồng bộ với MovieUpdate */}
      <header className="sticky top-0 z-[100] bg-white border-b-2 border-black px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="group flex items-center gap-2">
              <div className="p-2 border-2 border-black bg-white group-hover:bg-cyan-400 shadow-[3px_3px_0_0_black] transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="hidden md:block font-black uppercase text-[10px] tracking-widest">Quản lý</span>
            </Link>
            <Link to="/" className="p-2 border-2 border-black bg-white hover:bg-yellow-400 shadow-[3px_3px_0_0_black] transition-all ml-2">
              <Home size={18} />
            </Link>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-2 border-black shadow-[3px_3px_0_0_black]">
                <ShieldCheck size={14} className="text-amber-600" />
                <span className="text-[10px] font-black italic uppercase">Chế độ: Thêm phim mới</span>
             </div>
             <Link to="/admin/dashboard" className="group flex items-center gap-2">
               <span className="hidden md:block font-black uppercase text-[10px] tracking-widest text-red-500">Hủy bỏ</span>
               <div className="p-2 border-2 border-black bg-white group-hover:bg-red-500 group-hover:text-white shadow-[3px_3px_0_0_black] transition-all">
                 <XCircle size={18} />
               </div>
             </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="mb-10 flex items-center gap-4">
            <PlusSquare size={32} strokeWidth={2.5} />
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Đăng ký phim mới</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
            <div className="space-y-6">
              <SectionHeader icon={<Film size={16}/>} title="Thông tin cơ bản" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label label="Tiêu đề phim" />
                  <input 
                    {...register("title", { required: true })} 
                    className="brutalist-input font-black uppercase" 
                    placeholder="VÍ DỤ: AVENGERS: ENDGAME" 
                  />
                </div>
                <div>
                  <Label label="Thể loại (cách nhau bằng dấu phẩy)" />
                  <input 
                    {...register("genre")} 
                    className="brutalist-input" 
                    placeholder="Hành động, Phiêu lưu..." 
                  />
                </div>
                <div>
                  <Label label="Trạng thái hiển thị" />
                  <select {...register("status")} className="brutalist-input">
                    <option value="showing"> ĐANG CHIẾU</option>
                    <option value="coming">SẮP CHIẾU</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PHẦN 2: MEDIA */}
            <div className="space-y-6">
              <SectionHeader icon={<ImageIcon size={16}/>} title="Hình ảnh & Trailer" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label label="Poster URL" />
                  <input {...register("posterUrl")} className="brutalist-input text-xs font-mono" placeholder="https://..." />
                </div>
                <div>
                  <Label label="Banner URL" />
                  <input {...register("bannerUrl")} className="brutalist-input text-xs font-mono" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <Label label="YouTube Trailer ID hoặc URL" />
                  <input {...register("trailerUrl")} className="brutalist-input" placeholder="dQw4w9WgXcQ" />
                </div>
              </div>
            </div>

            {/* PHẦN 3: THÔNG SỐ */}
            <div className="space-y-6">
              <SectionHeader icon={<Settings2 size={16}/>} title="Thông số kỹ thuật & Nội dung" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <Label label="Rating (0-10)" />
                  <input type="number" step="0.1" {...register("rating")} className="brutalist-input" />
                </div>
                <div>
                  <Label label="Thời lượng (phút)" />
                  <input type="number" {...register("duration")} className="brutalist-input" />
                </div>
                <div className="md:col-span-2">
                  <Label label="Ngày khởi chiếu" />
                  <input type="date" {...register("releaseDate")} className="brutalist-input" />
                </div>
                <div className="md:col-span-4">
                  <Label label="Danh sách diễn viên (cách nhau bằng dấu phẩy)" />
                  <input {...register("cast")} className="brutalist-input" placeholder="Robert Downey Jr, Chris Evans..." />
                </div>
                <div className="md:col-span-4">
                  <Label label="Mô tả tóm tắt nội dung" />
                  <textarea 
                    rows="5" 
                    {...register("description")} 
                    className="brutalist-input py-4 resize-none" 
                    placeholder="Viết vài dòng giới thiệu về bộ phim..."
                  />
                </div>
              </div>
            </div>

            {/* NÚT SUBMIT */}
            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-black hover:bg-amber-500 text-white font-black py-6 shadow-[8px_8px_0_0_#000] transition-all uppercase tracking-widest active:translate-x-1 active:translate-y-1 active:shadow-none disabled:bg-slate-400"
            >
              {isSubmitting ? "ĐANG TẠO PHIM..." : "XÁC NHẬN THÊM PHIM MỚI"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* CSS Brutalist nội bộ */}
      <style>{`
        .brutalist-input { 
          width: 100%; 
          border: 2.5px solid #000; 
          padding: 0.8rem 1.2rem; 
          outline: none; 
          font-weight: 700; 
          transition: 0.2s; 
          border-radius: 0;
          font-size: 14px;
        } 
        .brutalist-input:focus { 
          background: #fffbeb; 
          box-shadow: 4px 4px 0 0 #000; 
          transform: translate(-2px, -2px); 
        }
      `}</style>
    </div>
  );
}

// Các component phụ đồng bộ UI
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-black text-white border-2 border-black shadow-[2px_2px_0_0_#f59e0b]">
        {icon}
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-widest italic text-black">
        {title}
      </h3>
      <div className="flex-1 h-[2px] bg-black opacity-10"></div>
    </div>
  );
}

function Label({ label }) {
  return (
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
      {label}
    </label>
  );
}