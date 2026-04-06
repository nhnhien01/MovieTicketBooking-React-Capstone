import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Search,
  Loader2,
  Zap,
  Gift,
  Moon,
  Send,
  Globe,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Navbar1 from "../components/Navbar1";
import { useAuthStore } from "../store/useAuthStore";

export default function Home1() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "vi");
  const navigate = useNavigate();

  const { authUser, isCheckingAuth } = useAuthStore();

  const handleBooking = (movieId) => {
    if (isCheckingAuth) return;
    if (!authUser) {
      alert(lang === "vi" ? "Vui lòng đăng nhập để đặt vé!" : "Please login to book tickets!");
      navigate(`/login?redirect=/movie/${movieId}`);
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  const promotions = [
    { id: 1, title: "Happy Monday - Vé 60k", color: "bg-red-500", icon: <Zap size={20}/> },
    { id: 2, title: "Ưu đãi sinh viên", color: "bg-blue-600", icon: <Gift size={20}/> },
    { id: 3, title: "Combo Giảm 20%", color: "bg-amber-500", icon: <Zap size={20}/> },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosClient.get("/movies");
        let data = Array.isArray(res?.data) ? res.data : res?.data?.movies || [];
        
        // Đảo ngược mảng để phim mới nhất lên đầu
        setMovies([...data].reverse());
      } catch (err) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!Array.isArray(movies)) return [];
    return movies.filter((m) =>
      m?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, movies]);

  // Lấy phim đầu tiên (sau khi reverse là phim mới nhất) làm banner
  const featuredMovie = filteredMovies?.length > 0 ? filteredMovies[0] : null;

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans selection:bg-amber-400 overflow-x-hidden">
      <Navbar1 />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black mt-16 md:mt-20">
        <AnimatePresence>
          {featuredMovie && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
              <img 
                src={featuredMovie?.bannerUrl || featuredMovie?.posterUrl} 
                className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10s] ease-linear" 
                alt="Banner" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-start">
          {featuredMovie && (
            <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-6">
                 <span className="bg-amber-400 text-black px-3 py-1 font-black text-xs uppercase tracking-widest italic border-2 border-black">
                    Hot Movie
                 </span>
                 <span className="text-white/60 font-bold uppercase text-xs tracking-[0.3em]">
                   {lang === "vi" ? "ĐANG CÔNG CHIẾU" : "NOW SHOWING"}
                 </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-10 max-w-4xl drop-shadow-2xl">
                {featuredMovie.title}
              </h1>
              
              <button
                onClick={() => handleBooking(featuredMovie._id)}
                disabled={isCheckingAuth}
                className={`bg-red-600 hover:bg-red-700 text-white px-10 py-5 font-black uppercase flex items-center gap-4 border-2 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-lg ${isCheckingAuth ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Ticket size={24} /> {lang === "vi" ? "ĐẶT VÉ NGAY" : "BOOK NOW"}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- SEARCH BAR --- */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white border-2 border-black p-1.5 shadow-[10px_10px_0_0_rgba(0,0,0,1)] flex items-center">
          <div className="p-4 bg-amber-400 text-black shrink-0 border-r-2 border-black">
            <Search size={24} strokeWidth={3} />
          </div>
          <input
            type="text"
            placeholder={lang === "vi" ? "Tìm tên phim..." : "Search movies..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 font-bold uppercase outline-none bg-transparent text-lg tracking-tight placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* --- PROMOTION SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
                <div key={promo.id} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group hover:bg-amber-50 cursor-default transition-colors">
                    <div className={`${promo.color} p-2 text-white border-2 border-black group-hover:rotate-12 transition-transform`}>
                        {promo.icon}
                    </div>
                    <span className="font-black uppercase italic text-sm tracking-tighter">{promo.title}</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- MOVIE GRID (CHỈ HIỆN 8 PHIM) --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-16 border-b-4 border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter relative">
            MOVIE SELECTION
          </h2>
          <button 
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 font-black uppercase italic text-sm hover:text-red-600 transition-colors group"
          >
            {lang === "vi" ? "Xem tất cả" : "View all"} 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={64} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {/* SỬ DỤNG .slice(0, 8) ĐỂ HIỆN 8 PHIM MỚI NHẤT */}
            {filteredMovies.slice(0, 8).map((movie) => (
              <div key={movie._id} onClick={() => handleBooking(movie._id)} className="group cursor-pointer">
                <div className="relative aspect-[2/3] border-2 border-black bg-gray-200 overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0_0_#fbbf24] transition-all duration-300">
                  <div className="absolute top-2 left-2 z-20 bg-red-600 text-white font-black px-2 py-0.5 border-2 border-black text-[10px]">T16</div>
                  <img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={movie.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center p-4 transition-opacity duration-300">
                    <div className="bg-white text-black font-black uppercase py-2 px-4 border-2 border-black text-xs shadow-[3px_3px_0_0_#fbbf24]">
                       {lang === "vi" ? "Đặt vé ngay" : "Book now"}
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 font-black uppercase text-lg italic leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                    {movie.title}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#222] text-[#ccc] mt-20 border-t-8 border-black pt-16 pb-10 px-6 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-700">
            <div className="space-y-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Moon className="text-amber-400 group-hover:rotate-12 transition-transform" fill="currentColor" size={24} />
                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">LUNA CINEMA</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Hotline đặt vé</p>
                <p className="text-3xl font-black text-amber-400 italic">1900 5199</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">Dịch vụ</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                <li onClick={() => navigate("/movies")} className="hover:text-amber-400 cursor-pointer flex items-center gap-2"><ChevronRight size={12}/> Phim đang chiếu</li>
                <li className="hover:text-amber-400 cursor-pointer flex items-center gap-2"><ChevronRight size={12}/> Phim sắp chiếu</li>
                <li className="hover:text-amber-400 cursor-pointer flex items-center gap-2"><ChevronRight size={12}/> Khuyến mãi hot</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">Hỗ trợ</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                <li className="hover:text-amber-400 cursor-pointer">Chính sách bảo mật</li>
                <li className="hover:text-amber-400 cursor-pointer">Chăm sóc khách hàng</li>
                <li className="hover:text-amber-400 cursor-pointer">Câu hỏi thường gặp</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">Theo dõi</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"><Send size={18}/></div>
                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"><Globe size={18}/></div>
                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"><MessageCircle size={18}/></div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
            <div className="text-[9px] font-bold uppercase text-center md:text-left leading-relaxed tracking-wider">
               LUNA CINEMA VIETNAM<br />
               Tầng 5, Tòa nhà Abstank, 123 Đường Hùng Vương, Thành phố Hồ Chí Minh
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em]">© 2026 LUNA CINEMA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}