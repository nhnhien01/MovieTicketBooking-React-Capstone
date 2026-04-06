import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, ChevronLeft, LayoutGrid, PlayCircle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Navbar1 from "../components/Navbar1";
import { useAuthStore } from "../store/useAuthStore";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // --- THÊM STATE ĐỂ PHÂN LOẠI ---
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'showing', 'coming'
  
  const navigate = useNavigate();
  const { authUser, isCheckingAuth } = useAuthStore();
  const lang = localStorage.getItem("app_lang") || "vi";

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

  // --- LOGIC LỌC PHIM ---
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch = m?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === "all" ? true : m.status === activeTab;
      return matchSearch && matchTab;
    });
  }, [searchTerm, movies, activeTab]);

  const handleBooking = (movieId) => {
    if (isCheckingAuth) return;
    if (!authUser) {
      alert(lang === "vi" ? "Vui lòng đăng nhập!" : "Please login!");
      navigate(`/login?redirect=/movie/${movieId}`);
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans selection:bg-amber-400">
      <Navbar1 />

      <div className="pt-32 pb-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 font-black uppercase text-xs mb-8 hover:text-red-600">
            <ChevronLeft size={16} /> {lang === "vi" ? "Quay lại" : "Back"}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                LUNA <span className="text-red-600">FILMS</span>
              </h1>
              
              {/* --- CỤM NÚT PHÂN LOẠI (FILTER TABS) --- */}
              <div className="flex flex-wrap gap-3 mt-8">
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

            <div className="relative w-full md:w-96">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><Search size={20} strokeWidth={3} /></div>
              <input
                type="text"
                placeholder={lang === "vi" ? "TÌM TÊN PHIM..." : "SEARCH..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-amber-400 border-2 border-black p-4 pl-12 font-black uppercase shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <span className="font-black uppercase italic">Loading...</span>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {filteredMovies.map((movie) => (
              <div key={movie._id} onClick={() => handleBooking(movie._id)} className="group cursor-pointer">
                <div className="relative aspect-[2/3] border-2 border-black bg-gray-200 overflow-hidden shadow-[5px_5px_0_0_#000] group-hover:shadow-[8px_8px_0_0_#fbbf24] transition-all duration-300">
                  <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />
                  
                  {/* Badge trạng thái trên ảnh */}
                  {movie.status === 'coming' && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-black px-2 py-1 uppercase tracking-tighter italic">Coming Soon</div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black to-transparent">
                     <button className="w-full bg-white text-black font-black uppercase py-2 border-2 border-black text-xs">
                        {lang === "vi" ? "Chi tiết" : "Details"}
                     </button>
                  </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-black uppercase text-sm md:text-base italic leading-tight line-clamp-2 group-hover:text-red-600">
                        {movie.title}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">
                        {Array.isArray(movie.genre) ? movie.genre.join(" / ") : movie.genre}
                    </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-4 border-dashed border-gray-300 bg-white shadow-[10px_10px_0_0_#e5e7eb]">
            <h3 className="text-2xl font-black uppercase italic text-gray-400">
              {lang === "vi" ? "Không tìm thấy phim phù hợp" : "No results found"}
            </h3>
          </div>
        )}
      </main>
      
      <footer className="bg-black text-white py-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Luna Cinema • {new Date().getFullYear()}</p>
          </div>
      </footer>
    </div>
  );
}

// --- COMPONENT NÚT BẤM PHÂN LOẠI RIÊNG ---
function FilterButton({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-3 font-black uppercase text-[11px] tracking-widest border-2 border-black transition-all
        ${active 
          ? "bg-black text-white -translate-x-1 -translate-y-1 shadow-[4px_4px_0_0_#fbbf24]" 
          : "bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
        }
      `}
    >
      {icon} {label}
    </button>
  );
}