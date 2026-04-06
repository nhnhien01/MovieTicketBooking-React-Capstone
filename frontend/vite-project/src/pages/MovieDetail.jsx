import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../api/axiosClient";
import SeatMap from "../components/SeatMap";
import { Play, Star, Clock, Ticket, Info, ChevronLeft, Share2 } from "lucide-react"; 
import { toast } from "sonner";

export default function MovieDetail() {
  const { id } = useParams();
  const cleanId = id?.startsWith(':') ? id.slice(1) : id;
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

  if (loading || !movie) return (
    <div className="h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-black border-t-amber-400 rounded-full animate-spin mb-4"></div>
      <p className="font-black text-black tracking-widest uppercase text-xs italic">
        {lang === "vi" ? "ĐANG TẢI..." : "LOADING..."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-black pb-20 font-sans selection:bg-amber-400">
      
      {/* 
          Tăng pt-16 lên pt-20 hoặc pt-24 để đẩy toàn bộ nội dung xuống.
          Đồng thời thêm item-start để đảm bảo bố cục không bị nhảy khi nội dung 2 bên lệch nhau.
      */}
      <main className="max-w-7xl mx-auto px-6 pt-20 lg:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Bên trái: Media Section */}
        <div className="lg:col-span-7">
          {/* Cụm điều hướng & Share */}
          <div className="flex items-center justify-between mb-10">
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} strokeWidth={3} /> 
              {lang === 'vi' ? 'Quay lại' : 'Back'}
            </button>
            
           
          </div>
          
          {/* 
              Khung Media: 
              
          */}
          <div className="relative mt-4 aspect-[16/9] bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] group">
            <AnimatePresence mode="wait">
              {activeMedia === "poster" ? (
                <motion.div 
                  key="poster" 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <img src={movie.posterUrl || movie.bannerUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setActiveMedia("trailer")}
                      className="bg-amber-400 border-2 border-black p-6 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform"
                    >
                      <Play fill="black" size={32} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="trailer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full bg-black">
                  <iframe 
                    src={getEmbedUrl(movie.trailerUrl)} 
                    className="w-full h-full border-none" 
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Switcher */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex p-1.5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
              <button 
                onClick={() => setActiveMedia("poster")} 
                className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all ${activeMedia === 'poster' ? 'bg-black text-white px-8' : 'text-black hover:bg-slate-100'}`}
              >
                POSTER
              </button>
              <button 
                onClick={() => setActiveMedia("trailer")} 
                className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all ${activeMedia === 'trailer' ? 'bg-amber-400 text-black px-8' : 'text-black hover:bg-slate-100'}`}
              >
                TRAILER
              </button>
            </div>
          </div>
        </div>

        {/* Bên phải: Info Section */}
        <div className="lg:col-span-5 flex flex-col space-y-10 lg:pt-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 border-2 border-black text-black px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {movie.status === 'showing' ? 'Đang chiếu' : 'Sắp chiếu'}
              </span>
              <div className="flex items-center gap-1.5 font-black text-xl">
                <Star size={22} fill="#fbbf24" strokeWidth={2}/> 
                {Number(movie.rating).toFixed(1)}
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase italic break-words drop-shadow-sm">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-slate-500 font-bold text-[11px] uppercase tracking-widest italic">
              <div className="flex items-center gap-1.5"><Clock size={16}/> {movie.duration} PHÚT</div>
              <span>/</span>
              <div className="text-black bg-slate-200 px-2 py-0.5 rounded border border-black/5">
                {Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border-2 border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Khởi chiếu</p>
              <p className="text-sm font-black italic">
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('vi-VN') : "TBA"}
              </p>
            </div>
            <div className="p-5 bg-white border-2 border-black rounded-[1.5rem] shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Định dạng</p>
              <p className="text-sm font-black italic tracking-tighter">2D • 3D • IMAX</p>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-4">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
              <Info size={16}/> Nội dung phim
            </h3>
            <p className="text-slate-700 leading-relaxed text-base font-medium border-l-4 border-amber-400 pl-6 italic">
              {movie.description || "Nội dung phim đang được cập nhật cho siêu phẩm này..."}
            </p>
          </div>

          <button 
            onClick={() => setIsBooking(true)} 
            className="group relative w-full py-6 bg-black text-white rounded-[2rem] font-black text-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            <Ticket size={28} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" /> 
            {lang === 'vi' ? 'ĐẶT VÉ NGAY' : 'BOOK NOW'}
          </button>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsBooking(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
           <motion.div 
  initial={{ scale: 0.9, opacity: 0, y: 20 }} 
  animate={{ scale: 1, opacity: 1, y: 0 }} 
  exit={{ scale: 0.9, opacity: 0, y: 20 }} 
  className="relative w-full max-w-2xl mx-auto" // Chỉ giữ lại độ rộng tối đa khớp với SeatMap
>
  <SeatMap movie={movie} onClose={() => setIsBooking(false)} />
</motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}