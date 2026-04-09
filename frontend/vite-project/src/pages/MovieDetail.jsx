import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../api/axiosClient";
import SeatMap from "../components/SeatMap";
import {
  Play,
  Star,
  Clock,
  Ticket,
  Info,
  ChevronLeft,
  User,
  Users,
  ShieldAlert,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

export default function MovieDetail() {
  const { id } = useParams();
  const cleanId = id?.startsWith(":") ? id.slice(1) : id;
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState("poster");
  const [isBooking, setIsBooking] = useState(false);
  const lang = localStorage.getItem("app_lang") || "vi";

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/movies/${cleanId}`);
        if (res.data) setMovie(res.data);
      } catch (err) {
        toast.error("Lỗi tải thông tin phim!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [cleanId, navigate]);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : "";
  };

  const getAgeLabel = (rating) => {
    const labels = {
      "P": "P - Mọi lứa tuổi",
      "K": "K - Dưới 13 tuổi",
      "T13": "C13 - Trên 13 tuổi",
      "T16": "C16 - Trên 16 tuổi",
      "T18": "C18 - Trên 18 tuổi"
    };
    return labels[rating] || rating || "Chưa phân loại";
  };

  if (loading || !movie)
    return (
      <div className="h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-100 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfcf0]/30 text-zinc-900 pb-20 font-sans selection:bg-amber-200">
      <main className="max-w-7xl mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT: MEDIA SECTION */}
        <div className="w-full lg:sticky lg:top-28">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-semibold text-xs uppercase tracking-widest mb-6 text-zinc-400 hover:text-amber-600 transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            {lang === "vi" ? "Quay lại" : "Back"}
          </button>

          {/* Media Frame with Hover Effect */}
          <div className="p-3 bg-white border border-zinc-200 rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="relative aspect-[16/9] bg-zinc-100 rounded-[2rem] overflow-hidden group">
              <AnimatePresence mode="wait">
                {activeMedia === "poster" ? (
                  <motion.div key="poster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative">
                    <img src={movie.bannerUrl || movie.posterUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <button onClick={() => setActiveMedia("trailer")} className="bg-amber-400 p-5 rounded-full shadow-2xl hover:scale-105 transition-transform">
                        <Play fill="black" size={32} className="text-black" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="trailer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full bg-black">
                    <iframe src={getEmbedUrl(movie.trailerUrl)} className="w-full h-full border-none" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Switcher: Visible only on hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button onClick={() => setActiveMedia("poster")} className={`px-5 py-2 text-[10px] font-bold rounded-full transition-all ${activeMedia === "poster" ? "bg-white text-black shadow-sm" : "text-white hover:bg-white/10"}`}>POSTER</button>
                <button onClick={() => setActiveMedia("trailer")} className={`px-5 py-2 text-[10px] font-bold rounded-full transition-all ${activeMedia === "trailer" ? "bg-white text-black shadow-sm" : "text-white hover:bg-white/10"}`}>TRAILER</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INFO SECTION */}
        <div className="w-full p-8 bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-red-50 text-red-600 px-4 py-1.5 font-bold text-[11px] uppercase rounded-full border border-red-100 flex items-center gap-1.5">
                <ShieldAlert size={14}/> {getAgeLabel(movie.ageRating)}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-sm">
                <Star size={18} className="text-amber-400" fill="currentColor" /> 
                <span className="text-zinc-900 font-bold">{Number(movie.rating).toFixed(1)}</span> / 10
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-600"><Clock size={15} /> {movie.duration} phút</span>
              <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
              <span className="text-zinc-600">{Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre}</span>
            </div>
          </div>

          <div className="space-y-8 pt-4">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2"><User size={14} className="text-amber-500" /> Đạo diễn</p>
                   <p className="font-bold text-base text-zinc-800 capitalize">{movie.director?.toLowerCase() || "TBA"}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Calendar size={14} className="text-amber-500" /> Khởi chiếu</p>
                   <p className="font-bold text-base text-zinc-800">{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("vi-VN") : "TBA"}</p>
                </div>
             </div>

             <div className="space-y-2">
               <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Users size={14} className="text-amber-500" /> Diễn viên chính</p>
               <div className="text-[15px] font-medium text-zinc-700 leading-relaxed capitalize">
                {movie.cast && movie.cast.length > 0 ? (
                  movie.cast.map(name => name.toLowerCase()).join(", ")
                ) : (
                  <span className="text-zinc-400 italic">Thông tin đang cập nhật...</span>
                )}
               </div>
             </div>

             <div className="space-y-3 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
               <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2"><Info size={14} className="text-amber-500" /> Nội dung phim</p>
               <p className="text-[15px] font-medium leading-relaxed text-zinc-600 italic">
                  {movie.description || "Nội dung phim đang được cập nhật..."}
               </p>
             </div>
          </div>

          <button
            onClick={() => setIsBooking(true)}
            className="group w-full py-5 bg-zinc-900 hover:bg-amber-400 text-white hover:text-black rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-zinc-200 hover:shadow-amber-100 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Ticket size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            {lang === "vi" ? "Đặt vé ngay" : "Book Tickets"}
          </button>
        </div>
      </main>

      {/* Modal SeatMap - No White Background Frame */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsBooking(false)} 
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" 
            />
            
            {/* SeatMap Container: Removed background, padding and border */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-5xl z-10"
            >
               <SeatMap movie={movie} onClose={() => setIsBooking(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}