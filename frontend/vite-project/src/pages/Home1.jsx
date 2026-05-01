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
  X,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Navbar1 from "../components/Navbar1";
import { useAuthStore } from "../store/useAuthStore";

export default function Home1() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showIntro, setShowIntro] = useState(false); // Mặc định ẩn, sẽ kiểm tra logic sau
  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "vi");
  const navigate = useNavigate();

  const { authUser, isCheckingAuth } = useAuthStore();

  // --- LOGIC HIỂN THỊ POSTER MỘT LẦN KHI ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      const hasSeenIntro = localStorage.getItem("luna_has_seen_intro");
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [authUser, isCheckingAuth]);

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem("luna_has_seen_intro", "true");
  };

  const handleBooking = (movieId) => {
    if (isCheckingAuth) return;
    if (!authUser) {
      alert(lang === "vi" ? "Vui lòng đăng nhập để đặt vé!" : "Please login to book tickets!");
      navigate(`/login?redirect=/movie/${movieId}`);
    } else {
      closeIntro(); // Đóng poster nếu đang mở khi nhấn đặt vé
      navigate(`/movie/${movieId}`);
    }
  };

  // --- FETCH DỮ LIỆU ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosClient.get("/movies");
        let data = Array.isArray(res?.data) ? res.data : res?.data?.movies || [];
        const sortedMovies = [...data].sort((a, b) => 
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
        setMovies(sortedMovies);
      } catch (err) {
        console.error("Fetch error:", err);
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
      m?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, movies]);

  const featuredMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return movies.find(m => m.status === 'coming') || movies[0];
  }, [movies]);

  const topRatedMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }, [movies]);

  const promotions = [
    { id: 1, title: "Happy Monday - Vé 60k", color: "bg-red-500", icon: <Zap size={20} /> },
    { id: 2, title: "Ưu đãi sinh viên", color: "bg-blue-600", icon: <Gift size={20} /> },
    { id: 3, title: "Combo Giảm 20%", color: "bg-amber-500", icon: <Zap size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans selection:bg-amber-400 overflow-x-hidden">
      
      {/* --- WELCOME POSTER (HIỆN 1 LẦN) --- */}
      <AnimatePresence>
        {showIntro && topRatedMovie && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <div className="absolute inset-0 opacity-30">
              <img src={topRatedMovie.bannerUrl || topRatedMovie.posterUrl} className="w-full h-full object-cover blur-md" alt="bg" />
            </div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center bg-[#fdfcf0] border-4 border-black shadow-[15px_15px_0_0_#fbbf24] p-6 md:p-10"
            >
              <div className="w-48 md:w-64 shrink-0 border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden aspect-[2/3] bg-gray-200">
                <img src={topRatedMovie.posterUrl} className="w-full h-full object-cover" alt="top-poster" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-red-600 text-white font-black px-3 py-1 border-2 border-black text-[10px] md:text-xs uppercase mb-4 shadow-[4px_4px_0_0_#000]">
                  MUST WATCH ★ {topRatedMovie.rating}/10
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 text-black">
                  {topRatedMovie.title}
                </h2>
                <p className="text-gray-600 font-bold text-xs md:text-sm mb-8 line-clamp-3 uppercase tracking-tight leading-relaxed">
                  {topRatedMovie.description || "Bộ phim xuất sắc nhất tuần này tại Luna Cinema."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => handleBooking(topRatedMovie._id)} className="bg-black text-white px-8 py-3 font-black uppercase italic text-sm hover:bg-amber-500 hover:text-black transition-all border-2 border-black flex items-center justify-center gap-2">
                    <Ticket size={18} /> ĐẶT VÉ NGAY
                  </button>
                  <button onClick={closeIntro} className="bg-transparent text-black border-2 border-black px-8 py-3 font-black uppercase italic text-sm hover:bg-white transition-all shadow-[4px_4px_0_0_#000]">
                    VÀO TRANG CHỦ
                  </button>
                </div>
              </div>

              <button onClick={closeIntro} className="absolute -top-5 -right-5 bg-white border-4 border-black p-2 hover:bg-red-500 hover:text-white transition-colors z-20">
                <X size={24} strokeWidth={4} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar1 />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black mt-16 md:mt-20">
        <AnimatePresence mode="wait">
          {featuredMovie && (
            <motion.div key={featuredMovie._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
              <img src={featuredMovie?.bannerUrl || featuredMovie?.posterUrl} className="w-full h-full object-cover opacity-60 scale-105" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-start">
          {featuredMovie && (
            <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-amber-400 text-black px-3 py-1 font-black text-xs uppercase border-2 border-black">
                  {featuredMovie.status === 'coming' ? "Coming Soon" : "New Arrival"}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-10 max-w-4xl drop-shadow-2xl">
                {featuredMovie.title}
              </h1>
              <button onClick={() => handleBooking(featuredMovie._id)} className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 font-black uppercase flex items-center gap-4 border-2 border-black shadow-[6px_6px_0_0_#000] transition-all">
                <Ticket size={24} /> {lang === "vi" ? "ĐẶT VÉ NGAY" : "BOOK NOW"}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- PROMOTION SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group cursor-default transition-colors">
              <div className={`${promo.color} p-2 text-white border-2 border-black group-hover:rotate-12 transition-transform`}>{promo.icon}</div>
              <span className="font-black uppercase italic text-sm tracking-tighter">{promo.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- MOVIE GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-black pb-8 gap-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">MOVIE SELECTION</h2>
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={20} />
            <input type="text" placeholder={lang === "vi" ? "TÌM TÊN PHIM..." : "SEARCH..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] outline-none font-bold uppercase text-sm" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={64} /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredMovies.slice(0, 4).map((movie) => (
                <motion.div layout key={movie._id} onClick={() => handleBooking(movie._id)} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] border-4 border-black bg-gray-200 overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0_0_#fbbf24] transition-all duration-300">
                    
                    
                    <div className="absolute top-3 left-3 z-20 bg-red-600 text-white font-black px-2 py-1 border-2 border-black text-[10px] shadow-[2px_2px_0_0_#000]">
                      {movie.ageRating || (movie.status === 'coming' ? 'SOON' : 'P')}
                    </div>

                  
                    <div className="absolute bottom-3 left-3 z-20 bg-amber-400 text-black font-black px-1.5 py-0.5 border-2 border-black text-[10px] flex items-center gap-1 shadow-[2px_2px_0_0_#000]">
                      <Star size={10} fill="black" /> {Number(movie.rating || 0).toFixed(1)}
                    </div>

                    <img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={movie.title} />
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <h3 className="font-black uppercase text-lg italic leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      {Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre || "Action"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-20 flex justify-center pt-12 border-t-2 border-black/5">
           <button onClick={() => navigate("/movies")} className="flex items-center gap-2 font-black uppercase italic text-sm hover:text-red-600 transition-colors group">
            {lang === "vi" ? "Khám phá tất cả phim" : "View all movies"}
            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
    <footer className="bg-[#222] text-[#ccc] mt-20 border-t-8 border-black pt-16 pb-10 px-6 font-sans">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-700">

            <div className="space-y-6">

              <div

                className="flex items-center gap-2 group cursor-pointer"

                onClick={() => navigate("/")}

              >

                <Moon

                  className="text-amber-400 group-hover:rotate-12 transition-transform"

                  fill="currentColor"

                  size={24}

                />

                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">

                  LUNA CINEMA

                </span>

              </div>

              <div className="space-y-1">

                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">

                  Hotline đặt vé

                </p>

                <p className="text-3xl font-black text-amber-400 italic">

                  1900 5199

                </p>

              </div>

            </div>



            <div>

              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">

                Dịch vụ

              </h4>

              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">

                <li onClick={() => navigate("/movies", { state: { filter: "showing" } })} className="hover:text-amber-400 cursor-pointer flex items-center gap-2">

                  <ChevronRight size={12} /> Phim đang chiếu

                </li>

                <li onClick={() => navigate("/movies", { state: { filter: "coming" } })} className="hover:text-amber-400 cursor-pointer flex items-center gap-2">

                  <ChevronRight size={12} /> Phim sắp chiếu

                </li>

                <li className="hover:text-amber-400 cursor-pointer flex items-center gap-2">

                  <ChevronRight size={12} /> Khuyến mãi hot

                </li>

              </ul>

            </div>



            <div>

              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">

                Hỗ trợ

              </h4>

              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">

                <li onClick={() => navigate("/privacy-policy")} className="hover:text-amber-400 cursor-pointer transition-colors">

                  Chính sách bảo mật

                </li>

                <li onClick={() => navigate("/customer-care")} className="hover:text-amber-400 cursor-pointer transition-colors">

                  Chăm sóc khách hàng

                </li>

                <li onClick={() => navigate("/faq")} className="hover:text-amber-400 cursor-pointer transition-colors">

                  Câu hỏi thường gặp

                </li>

              </ul>

            </div>



            <div>

              <h4 className="text-white font-black uppercase text-xs mb-6 border-l-4 border-amber-400 pl-3 tracking-widest">

                Theo dõi

              </h4>

              <div className="flex gap-4">

                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]">

                  <Send size={18} />

                </div>

                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]">

                  <Globe size={18} />

                </div>

                <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all cursor-pointer shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]">

                  <MessageCircle size={18} />

                </div>

              </div>

            </div>

          </div>



          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">

            <div className="text-[9px] font-bold uppercase text-center md:text-left leading-relaxed tracking-wider">

              LUNA CINEMA VIETNAM

              <br />

              Tầng 5, Tòa nhà Abstank, 123 Đường Hùng Vương, Thành phố Hồ Chí Minh

            </div>

            <p className="text-[9px] font-black uppercase tracking-[0.2em]">

              © 2026 LUNA CINEMA. ALL RIGHTS RESERVED.

            </p>

          </div>

        </div>

      </footer>
    </div>
  );
}