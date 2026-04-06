import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Film,
  Users,
  Ticket,
  Plus,
  Search,
  Bell,
  Settings,
  Star,
  Trash2,
  Loader2,
  LogOut,
  ChevronRight,
  Home,
  ExternalLink,
  Moon, // Sử dụng Moon cho đúng logo trang chủ
  Hash,
} from "lucide-react";

import { useMovieStore } from "../../store/useMovieStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function Dashboard12() {
  const navigate = useNavigate();
  const { movies, fetchMovies, loading, deleteMovie } = useMovieStore();
  const { authUser, logout } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Xác nhận gỡ bỏ phim: ${title}?`)) {
      await deleteMovie(id);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      movie.title?.toLowerCase().includes(searchLower) ||
      movie.genre?.some((g) => g.toLowerCase().includes(searchLower))
    );
  });

  const stats = [
    { label: "Doanh Thu", value: "1.25B", trend: "+12.5%" },
    { label: "Vé Bán Ra", value: "14,205", trend: "+8.2%" },
    { label: "Phim Hệ Thống", value: movies.length, trend: "Stable" },
    { label: "Khách Hàng", value: "2,840", trend: "+24%" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 flex font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden xl:flex flex-col p-6 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* LOGO LUNA CINEMA - THEO PHONG CÁCH BRUTALISM CỦA BẠN */}
        <div className="px-4 py-8">
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-amber-400 border-[2.5px] border-black p-1.5 -rotate-2 group-hover:rotate-3 group-hover:scale-110 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Moon className="text-black" size={22} fill="currentColor" />
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-2xl font-black tracking-tighter italic uppercase text-black leading-none">
                Luna<span className="text-amber-500"> Cinema</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
                Administrator
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          {/* Nút về trang chủ cũng theo style Amber */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm text-slate-500 hover:text-amber-600 hover:bg-amber-50 mb-4 border border-dashed border-slate-200 hover:border-amber-400"
          >
            <Home size={18} /> <span>Về Trang Chủ</span>
            <ExternalLink size={14} className="ml-auto opacity-50" />
          </Link>

          <div className="h-[1px] bg-slate-100 my-4 mx-4" />

          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Tổng quan"
            active
          />
          <NavItem
            icon={<Film size={18} />}
            label="Quản lý phim"
            onClick={() => navigate("/admin/add-movie")}
          />
          <NavItem icon={<Ticket size={18} />} label="Lịch chiếu" />
          <NavItem
            icon={<Users size={18} />}
            label="Người dùng"
            onClick={() => navigate("/admin/users")}
          />
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg">
              {authUser?.displayName?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {authUser?.displayName || "Admin"}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Administrator
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-100/50 transition-colors"
          >
            <LogOut size={14} /> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8FAFC]">
        {/* TOP HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
              DASHBOARD
            </h1>
            <p className="text-slate-400 text-sm font-medium italic uppercase tracking-wider">
              Hệ thống quản trị Luna Cinema
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm tên phim hoặc thể loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all shadow-sm"
              />
            </div>
            <button className="bg-white p-3.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-amber-500 transition-all shadow-sm relative group">
              <Bell size={20} className="group-hover:shake" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:border-amber-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {s.label}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg">
                  {s.trend}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                {s.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-50">
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">
                Quản lý kho phim
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {searchTerm
                  ? `Kết quả tìm kiếm cho: "${searchTerm}"`
                  : `Tổng cộng ${movies.length} tác phẩm`}
              </p>
            </div>
            <Link
              to="/admin/add-movie"
              className="w-full md:w-auto bg-black text-amber-400 border-2 border-black px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <Plus size={20} strokeWidth={3} /> THÊM PHIM MỚI
            </Link>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-amber-500">
                <Loader2 className="animate-spin mb-4" size={40} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                  Syncing with database...
                </span>
              </div>
            ) : (
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em]">
                    <th className="pb-2 px-4 text-center w-16">STT</th>
                    <th className="pb-2 px-4 text-left">Phim & Mã định danh</th>
                    <th className="pb-2 text-left">Thể loại</th>
                    <th className="pb-2 text-left">Đánh giá</th>
                    <th className="pb-2 text-left">Trạng thái</th>
                    <th className="pb-2 text-right px-6">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie, index) => (
                      <tr key={movie._id} className="group">
                        <td className="py-4 text-center bg-slate-50 group-hover:bg-amber-50 rounded-l-3xl font-black text-slate-400 group-hover:text-amber-600 transition-colors">
                          #{index + 1}
                        </td>

                        <td className="py-4 px-4 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={movie.posterUrl}
                                className="w-12 h-16 rounded-xl object-cover border-2 border-transparent group-hover:border-black transition-all shadow-sm"
                                alt={movie.title}
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm line-clamp-1 uppercase italic tracking-tight">
                                {movie.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-tighter">
                                ID: {movie._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                          <span className="text-[9px] font-black bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 uppercase group-hover:border-amber-400 transition-colors">
                            {movie.genre?.[0] || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                          <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                            <Star
                              size={14}
                              className="text-amber-500 fill-amber-500"
                            />
                            <span>{movie.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight
                            ${movie.status === "showing" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-blue-100 text-blue-700 border border-blue-200"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${movie.status === "showing" ? "bg-emerald-500" : "bg-blue-500"}`}
                            />
                            {movie.status === "showing"
                              ? "Đang chiếu"
                              : "Sắp chiếu"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right bg-slate-50 group-hover:bg-amber-50 rounded-r-3xl transition-colors">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                navigate(`/admin/edit-movie/${movie._id}`)
                              }
                              className="p-2.5 bg-white text-slate-600 hover:text-black hover:bg-amber-400 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(movie._id, movie.title)
                              }
                              className="p-2.5 bg-white text-slate-600 hover:text-white hover:bg-red-500 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="inline-flex flex-col items-center">
                          <Search size={40} className="text-slate-200 mb-4" />
                          <p className="text-slate-400 font-bold italic uppercase tracking-widest">
                            Không tìm thấy phim: "{searchTerm}"
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-black text-sm uppercase tracking-tight
        ${
          active
            ? "bg-amber-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-[-2px]"
            : "text-slate-400 hover:text-black hover:bg-amber-50 hover:translate-x-1"
        }`}
    >
      {icon} <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={14} strokeWidth={3} />}
    </button>
  );
}
