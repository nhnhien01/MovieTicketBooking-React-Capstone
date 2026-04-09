import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Ticket,
  Plus,
  Search,
  Star,
  Trash2,
  LogOut,
  ChevronRight,
  Moon,
  MapPin,
  Pencil,
  ArrowLeft,
  Home,
  BarChart3,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

import { useMovieStore } from "../../store/useMovieStore";
import { useAuthStore } from "../../store/useAuthStore";
import CinemaManagement from "./CinemaManagement";
import axiosClient from "../../api/axiosClient"; // Đảm bảo bạn đã có axios instance

export default function Dashboard12() {
  const navigate = useNavigate();
  const { movies, fetchMovies, deleteMovie } = useMovieStore();
  const { logout } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("movies"); // movies | cinemas | bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    fetchMovies();
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [fetchMovies, activeTab]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await axiosClient.get("/bookings/admin/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Lỗi tải đặt vé:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Xác nhận gỡ bỏ phim: ${title}?`)) {
      await deleteMovie(id);
    }
  };

  // Logic lọc dữ liệu chung cho cả Phim và Đặt vé
  const filteredMovies = movies.filter((m) =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) =>
    b.userId?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.movieId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Doanh Thu", value: "1.25B", trend: "+12.5%", icon: <BarChart3 size={20} /> },
    { label: "Vé Bán Ra", value: "14,205", trend: "+8.2%", icon: <Ticket size={20} /> },
    { label: "Chi Nhánh", value: "35", trend: "Ổn định", icon: <MapPin size={20} /> },
    { label: "Khách Hàng", value: "2,840", trend: "+24%", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col p-6 sticky top-0 h-screen shadow-sm">
        <div className="px-4 py-8">
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-amber-400 border-[2.5px] border-black p-1.5 -rotate-2 group-hover:rotate-3 group-hover:scale-110 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Moon className="text-black" size={22} fill="currentColor" />
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-2xl font-black tracking-tighter italic uppercase text-black leading-none">
                Luna<span className="text-amber-500"> Cinema</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Administrator</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Điều hành</div>
          
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Tổng quan phim" 
            active={activeTab === "movies"} 
            onClick={() => { setActiveTab("movies"); setSearchTerm(""); }}
          />
          <NavItem 
            icon={<MapPin size={18} />} 
            label="Quản lý rạp" 
            active={activeTab === "cinemas"}
            onClick={() => { setActiveTab("cinemas"); setSearchTerm(""); }}
          />
          <NavItem 
            icon={<CalendarCheck size={18} />} 
            label="Quản lý đặt vé" 
            active={activeTab === "bookings"}
            onClick={() => { setActiveTab("bookings"); setSearchTerm(""); }} 
          />
          
          <div className="pt-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Dữ liệu & Nhân sự</div>
            <NavItem 
              icon={<Plus size={18} strokeWidth={3} />} 
              label="Thêm phim mới" 
              onClick={() => navigate("/admin/add-movie")}
            />
            <NavItem 
              icon={<Users size={18} />} 
              label="Người dùng" 
              onClick={() => navigate("/admin/users")} 
            />
          </div>
        </nav>

        <div className="mt-auto space-y-3">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase hover:bg-black hover:text-white transition-all border border-slate-200">
            <Home size={16} /> Về trang chủ
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase text-white bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all">
            <LogOut size={14} /> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-12 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                {activeTab === "movies" ? "Quản lý phim" : activeTab === "cinemas" ? "Hệ thống rạp" : "Quản lý đặt vé"}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold italic uppercase tracking-[0.2em] mt-1.5">
                Luna Cinema <span className="text-amber-500 mx-1">•</span> Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm thông tin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black focus:ring-4 focus:ring-amber-400/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* STATS CARDS (Giữ nguyên) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">{s.icon}</div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                <span className="text-[10px] font-black px-2 py-1 bg-green-100 text-green-700 rounded-lg">{s.trend}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* DATA CONTAINER */}
        <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px]">
          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">
                {activeTab === "movies" ? "Kho phim hiện có" : activeTab === "cinemas" ? "Danh sách chi nhánh" : "Lịch sử giao dịch"}
              </h3>
            </div>
            
            {activeTab !== "bookings" && (
              <button 
                onClick={() => activeTab === "movies" ? navigate("/admin/add-movie") : alert("Thêm rạp mới")}
                className="bg-black text-amber-400 border-2 border-black px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={3} /> {activeTab === "movies" ? "Thêm phim" : "Mở chi nhánh"}
              </button>
            )}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "movies" ? (
                <motion.div key="movies-table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="overflow-x-auto px-2 pb-6">
                    <table className="w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                          <th className="pb-2 px-4 text-center w-16">STT</th>
                          <th className="pb-2 text-left">Tên phim</th>
                          <th className="pb-2 text-left">Đánh giá</th>
                          <th className="pb-2 text-right px-6">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMovies.map((movie, index) => (
                          <tr key={movie._id} className="group">
                            <td className="py-4 text-center bg-slate-50 border-y-2 border-l-2 border-slate-100 rounded-l-2xl font-black text-slate-400">{String(index + 1).padStart(2, '0')}</td>
                            <td className="py-4 px-4 bg-slate-50 border-y-2 border-slate-100">
                              <div className="flex items-center gap-4">
                                <img src={movie.posterUrl} className="w-12 h-16 rounded-xl object-cover border-2 border-white shadow-sm" alt="" />
                                <span className="font-black text-sm uppercase italic tracking-tighter">{movie.title}</span>
                              </div>
                            </td>
                            <td className="py-4 bg-slate-50 border-y-2 border-slate-100">
                                <div className="flex items-center gap-1 font-black text-amber-500 text-sm">
                                    <Star size={14} fill="currentColor"/> {movie.rating}
                                </div>
                            </td>
                            <td className="py-4 pr-6 text-right bg-slate-50 border-y-2 border-r-2 border-slate-100 rounded-r-2xl">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => navigate(`/admin/update-movie/${movie._id}`)} className="p-2.5 bg-white border-2 border-black hover:bg-cyan-400 transition-all rounded-xl"><Pencil size={18}/></button>
                                    <button onClick={() => handleDelete(movie._id, movie.title)} className="p-2.5 bg-white border-2 border-black hover:bg-red-500 hover:text-white transition-all rounded-xl"><Trash2 size={18}/></button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : activeTab === "cinemas" ? (
                <motion.div key="cinemas-table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <CinemaManagement externalSearch={searchTerm} />
                </motion.div>
              ) : (
                <motion.div key="bookings-table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="overflow-x-auto px-2 pb-6">
                    <table className="w-full border-separate border-spacing-y-4">
                      <thead>
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-left">
                          <th className="px-6">Khách hàng</th>
                          <th>Phim / Rạp</th>
                          <th>Ghế</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                          <th className="text-right px-6">Ngày đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingBookings ? (
                          <tr><td colSpan="6" className="text-center py-20 font-black uppercase italic text-slate-400">Đang tải dữ liệu vé...</td></tr>
                        ) : filteredBookings.map((booking) => (
                          <tr key={booking._id} className="group">
                            <td className="bg-slate-50 border-y-2 border-l-2 border-slate-100 p-4 rounded-l-2xl">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center border border-black shadow-[2px_2px_0_0_black] font-black text-xs">
                                  {booking.userId?.displayName?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-[11px] uppercase italic">{booking.userId?.displayName || "N/A"}</p>
                                  <p className="text-[9px] font-bold text-slate-400">{booking.userId?.phone || "No Phone"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="bg-slate-50 border-y-2 border-slate-100 p-4">
                              <p className="font-black text-[11px] uppercase tracking-tighter">{booking.movieId?.title}</p>
                              <p className="text-[9px] font-bold text-amber-600 uppercase italic">Chi nhánh số #1</p>
                            </td>
                            <td className="bg-slate-50 border-y-2 border-slate-100 p-4">
                              <div className="flex flex-wrap gap-1">
                                {booking.seats?.map(s => <span key={s} className="bg-black text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{s}</span>)}
                              </div>
                            </td>
                            <td className="bg-slate-50 border-y-2 border-slate-100 p-4 font-black text-xs italic">{booking.totalAmount?.toLocaleString()}đ</td>
                            <td className="bg-slate-50 border-y-2 border-slate-100 p-4 text-center">
                              <StatusBadge status={booking.status} />
                            </td>
                            <td className="bg-slate-50 border-y-2 border-r-2 border-slate-100 p-4 rounded-r-2xl text-right text-[10px] font-black text-slate-400">
                              {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components giữ nguyên logic cũ của bạn
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-black text-sm uppercase tracking-tight border-2
        ${active 
          ? "bg-amber-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-[-2px]" 
          : "text-slate-400 border-transparent hover:text-black hover:bg-white hover:border-slate-200 hover:translate-x-1"}`}
    >
      <span className={active ? "text-black" : "text-slate-400"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={14} strokeWidth={3} />}
    </button>
  );
}

function StatusBadge({ status }) {
    const config = {
      confirmed: { color: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: <CheckCircle2 size={12} />, text: "Xác nhận" },
      pending: { color: "bg-amber-100 text-amber-600 border-amber-200", icon: <Clock size={12} />, text: "Chờ" },
      cancelled: { color: "bg-red-100 text-red-600 border-red-200", icon: <XCircle size={12} />, text: "Hủy" },
    };
    const { color, icon, text } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase ${color}`}>
        {icon} {text}
      </span>
    );
}