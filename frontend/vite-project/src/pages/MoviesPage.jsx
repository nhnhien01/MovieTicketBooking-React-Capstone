import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, ChevronLeft, LayoutGrid, PlayCircle, CalendarDays, Star, ShieldAlert } from "lucide-react";
import axiosClient from "../api/axiosClient";
import Navbar1 from "../components/Navbar1";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); 
  
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, isCheckingAuth } = useAuthStore();
  const lang = localStorage.getItem("app_lang") || "vi";

  useEffect(() => {
    if (location.state?.filter) {
      setActiveTab(location.state.filter);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const res = await axiosClient.get("/movies");
        const data = Array.isArray(res?.data) ? res.data : res?.data?.movies || [];
        setMovies([...data].reverse());
      } catch (err) {
        console.error("Lỗi:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const titleMatch = m?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      // Lọc theo cả tên đạo diễn nếu người dùng nhập tìm kiếm
      const directorMatch = m?.director?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === "all" ? true : m.status === activeTab;
      return (titleMatch || directorMatch) && matchTab;
    });
  }, [searchTerm, movies, activeTab]);

  const handleBooking = (movieId) => {
    if (isCheckingAuth) return;
    if (!authUser) {
      navigate(`/login?redirect=/movie/${movieId}`);
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans selection:bg-amber-400">
      <Navbar1 />

      {/* HEADER SECTION */}
      <div className="pt-32 pb-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-black uppercase text-xs mb-8 hover:text-red-600 transition-colors">
            <ChevronLeft size={16} strokeWidth={3} /> {lang === "vi" ? "TRANG CHỦ" : "HOME"}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
                LUNA <span className="text-red-600">FILMS</span>
              </h1>
              
              <div className="flex flex-wrap gap-3 mt-10">
                <FilterButton 
                  active={activeTab === "all"} 
                  onClick={() => setActiveTab("all")}
                  label={lang === "vi" ? "TẤT CẢ" : "ALL"}
                  icon={<LayoutGrid size={16}/>}
                />
                <FilterButton 
                  active={activeTab === "showing"} 
                  onClick={() => setActiveTab("showing")}
                  label={lang === "vi" ? "ĐANG CHIẾU" : "NOW SHOWING"}
                  icon={<PlayCircle size={16}/>}
                />
                <FilterButton 
                  active={activeTab === "coming"} 
                  onClick={() => setActiveTab("coming")}
                  label={lang === "vi" ? "SẮP CHIẾU" : "COMING SOON"}
                  icon={<CalendarDays size={16}/>}
                />
              </div>
            </div>

            <div className="relative w-full md:w-96 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10">
                <Search size={20} strokeWidth={3} />
              </div>
              <input
                type="text"
                placeholder={lang === "vi" ? "TÌM PHIM, ĐẠO DIỄN..." : "SEARCH MOVIES..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full bg-amber-400 border-4 border-black p-4 pl-12 font-black uppercase shadow-[6px_6px_0_0_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none placeholder:text-black/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOVIES GRID */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-red-600" size={60} strokeWidth={3} />
            <span className="font-black uppercase italic tracking-widest text-xl">Loading...</span>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
            {filteredMovies.map((movie) => (
              <div key={movie._id} onClick={() => handleBooking(movie._id)} className="group cursor-pointer">
                {/* Poster Container */}
                <div className="relative aspect-[2/3] border-4 border-black bg-gray-200 overflow-hidden shadow-[8px_8px_0_0_#000] group-hover:shadow-[12px_12px_0_0_#fbbf24] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                  <img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={movie.title} />
                  
                  {/* Age Rating Badge */}
                  <div className="absolute top-3 right-3 bg-red-600 text-white border-2 border-black text-[10px] font-black px-2 py-1 shadow-[2px_2px_0_0_#000]">
                    {movie.ageRating || "P"}
                  </div>

                  {/* Status Overlay */}
                  {movie.status === 'coming' && (
                    <div className="absolute top-3 left-0 bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest italic border-r-2 border-y-2 border-black">
                      Coming Soon
                    </div>
                  )}

                  {/* Rating Overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-400 border-2 border-black px-2 py-0.5 font-black text-xs shadow-[2px_2px_0_0_#000]">
                    <Star size={12} fill="black" /> {Number(movie.rating).toFixed(1)}
                  </div>

                  {/* Hover Detail Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                    <button className="w-full bg-white text-black font-black uppercase py-3 border-4 border-black text-sm shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                      {lang === "vi" ? "MUA VÉ" : "TICKETS"}
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="mt-6 space-y-1">
                    <h3 className="font-black uppercase text-lg italic leading-none line-clamp-2 group-hover:text-red-600 transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                            {Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre}
                        </p>
                    </div>
                    {movie.director && (
                      <p className="text-[9px] font-bold text-gray-500 uppercase italic">
                         Đạo diễn: {movie.director}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-8 border-black bg-white shadow-[20px_20px_0_0_#e5e7eb] rotate-1">
            <h3 className="text-4xl font-black uppercase italic text-black">
              {lang === "vi" ? "KHÔNG TÌM THẤY PHIM!" : "FILM NOT FOUND!"}
            </h3>
            <p className="font-bold uppercase text-gray-400 mt-4 tracking-widest">Try another search term</p>
          </div>
        )}
      </main>
      
      <footer className="bg-black text-white py-16 border-t-8 border-amber-400">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="text-4xl font-black italic tracking-tighter">LUNA CINEMA </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
              © {new Date().getFullYear()} LUNA CINEMA• ALL RIGHTS RESERVED
            </p>
          </div>
      </footer>
    </div>
  );
}

function FilterButton({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-4 font-black uppercase text-[12px] tracking-widest border-4 border-black transition-all
        ${active 
          ? "bg-black text-white -translate-x-1 -translate-y-1 shadow-[6px_6px_0_0_#fbbf24]" 
          : "bg-white text-black hover:bg-amber-100 shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
        }
      `}
    >
      {icon} {label}
    </button>
  );
}