import { useEffect, useState } from "react";
import { Moon, User, LogOut, ChevronRight, LayoutDashboard } from "lucide-react"; // Thêm icon Dashboard
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "vi");

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem("app_lang") || "vi");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    window.dispatchEvent(new Event("storage")); 
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b-[3px] border-black h-20 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group outline-none">
          <div className="bg-amber-400 border-[2.5px] border-black p-1.5 -rotate-2 group-hover:rotate-3 group-hover:scale-110 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Moon className="text-black" size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic uppercase text-black ml-1">
            Luna<span className="text-amber-500"> Cinema</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em]">
          {["Phim", "Rạp"].map((item, index) => {
            const path = index === 0 ? "/" : "/cinemas";
            const isActive = location.pathname === path;
            return (
              <Link 
                key={item} to={path} 
                className={`relative pb-1 transition-all hover:text-amber-600 ${isActive ? 'text-amber-600 border-b-2 border-black' : 'text-gray-900'}`}
              >
                {lang === "vi" ? item : (index === 0 ? "Movies" : "Cinemas")}
              </Link>
            );
          })}
          
          {/* --- NÚT ADMIN CHỈ HIỆN KHI LÀ ADMIN --- */}
          {authUser?.role === "admin" && (
            <Link 
              to="/admin/movies" 
              className={`flex items-center gap-2 px-3 py-1 bg-black text-amber-400 border-2 border-black hover:bg-amber-400 hover:text-black transition-all ${location.pathname.startsWith('/admin') ? 'bg-amber-400 text-black' : ''}`}
            >
              <LayoutDashboard size={14} />
              <span>ADMIN</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          <button onClick={toggleLang} className="w-10 h-10 border-[2.5px] border-black font-black text-[10px] flex items-center justify-center bg-white hover:bg-black hover:text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all">
            {lang === "vi" ? "VN" : "EN"}
          </button>

          {authUser ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 bg-white border-[2.5px] border-black pl-1.5 pr-4 py-1.5 shadow-[5px_5px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 bg-black border-2 border-black rounded-lg flex items-center justify-center overflow-hidden shrink-0 group-hover:rotate-3 transition-transform">
                  {authUser?.profilePic ? (
                    <img src={authUser.profilePic} alt="me" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} strokeWidth={3} className="text-amber-400" />
                  )}
                </div>
                
                <div className="flex flex-col items-start leading-none">
                  {/* HIỂN THỊ ROLE ADMIN NGAY TẠI ĐÂY NẾU CÓ */}
                  <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${authUser?.role === 'admin' ? 'text-amber-600' : 'text-gray-400'}`}>
                    {authUser?.role === "admin" ? "ADMINISTRATOR" : (lang === "vi" ? "Thành viên" : "Member")}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-sm uppercase tracking-tight text-black">
                      {authUser?.displayName || authUser?.username || "User"}
                    </span>
                    <ChevronRight size={14} strokeWidth={4} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <button onClick={logout} className="p-2.5 text-gray-400 hover:text-red-600 transition-colors">
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="group relative inline-flex items-center gap-2 bg-black text-white px-7 py-3 font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              {lang === "vi" ? "Đăng nhập" : "Login"}
              <div className="bg-amber-400 p-0.5 text-black group-hover:rotate-12 transition-transform">
                <ChevronRight size={14} strokeWidth={4} />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}