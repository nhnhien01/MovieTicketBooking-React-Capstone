import { useEffect, useState } from "react";
import { 
  Ticket, Search, Calendar, User, CheckCircle2, Clock, XCircle, ArrowLeft,
  LayoutDashboard, Users, MapPin, CalendarCheck, Home, ChevronRight
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function BookingManagement() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // 1. Lấy user từ localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      
      if (!storedUser || !storedUser._id) {
        toast.error("Vui lòng đăng nhập!");
        return;
      }

      // 2. Gửi userId qua query params để khớp với backend đã sửa ở trên
      const response = await axiosClient.get(`/bookings/my-history?userId=${storedUser._id}`); 
      
      // 3. Nhận dữ liệu
      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);
      
    } catch (error) {
      console.error("Fetch history error:", error);
      toast.error("Không thể tải lịch sử đặt vé");
    } finally {
      setLoading(false);
    }
  };
  fetchHistory();
}, []);
  // Cập nhật logic filter để tìm kiếm theo: Tên khách, Tên phim, Tên rạp
  const filteredBookings = bookings.filter(b => {
    const userName = b.userId?.displayName?.toLowerCase() || "";
    const movieTitle = b.movieId?.title?.toLowerCase() || "";
    const cinemaName = b.cinemaName?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return userName.includes(search) || movieTitle.includes(search) || cinemaName.includes(search);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col p-6 sticky top-0 h-screen shadow-sm">
        <div className="px-4 py-8">
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-amber-400 border-[2.5px] border-black p-1.5 -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Ticket className="text-black" size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black italic uppercase text-black leading-none">
              Luna<span className="text-amber-500"> Cinema</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Điều hành</div>
          <NavItem icon={<LayoutDashboard size={18} />} label="Tổng quan" onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon={<MapPin size={18} />} label="Quản lý rạp" onClick={() => navigate("/admin/cinemas")} />
          <NavItem icon={<CalendarCheck size={18} />} label="Quản lý đặt vé" active />
          
          <div className="pt-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Nhân sự</div>
            <NavItem icon={<Users size={18} />} label="Người dùng" onClick={() => navigate("/admin/users")} />
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 font-black text-xs uppercase hover:bg-black hover:text-white transition-all mb-3">
            <Home size={16} /> Về trang chủ
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <button onClick={() => navigate("/admin/dashboard")} className="flex items-center justify-center w-12 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                Booking <span className="text-amber-500">Log</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" /> Hệ thống kiểm soát vé thời gian thực
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm khách, phim hoặc tên rạp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-black transition-all shadow-sm outline-none"
            />
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-8 border-b-2 border-slate-100 bg-slate-50/30 flex justify-between items-center">
             <div className="flex items-center gap-3 font-black text-xl uppercase italic">
                <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
                Lịch sử giao dịch
             </div>
             <span className="bg-black text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-[4px_4px_0_0_#fbbf24]">
               {filteredBookings.length} Đơn hàng
             </span>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="px-6">Khách hàng</th>
                  <th>Thông tin phim</th>
                  <th>Rạp & Suất chiếu</th> {/* CỘT MỚI */}
                  <th>Ghế</th>
                  <th>Tổng tiền</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-right px-6">Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-20 font-black uppercase italic text-slate-400 text-sm">Đang tải dữ liệu...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-20 font-black uppercase italic text-slate-400 text-sm">Không tìm thấy vé phù hợp.</td></tr>
                ) : filteredBookings.map((booking) => (
                  <tr key={booking._id} className="group transition-all">
                    {/* Khách hàng */}
                    <td className="bg-slate-50 border-y-2 border-l-2 border-slate-100 p-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-black shadow-[2px_2px_0_0_black]">
                          <User size={18} className="text-black" />
                        </div>
                        <div>
                          <p className="font-black text-xs uppercase italic truncate max-w-[100px]">{booking.userId?.displayName || "Khách ẩn danh"}</p>
                          <p className="text-[9px] font-bold text-slate-400">{booking.userId?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phim */}
                    <td className="bg-slate-50 border-y-2 border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                         <img 
                            src={booking.movieId?.posterUrl || "https://via.placeholder.com/150"} 
                            alt={booking.movieId?.title}
                            className="w-8 h-10 object-cover rounded border border-black shadow-[2px_2px_0_0_black]" 
                         />
                         <p className="font-black text-[11px] uppercase tracking-tighter max-w-[120px] line-clamp-2">{booking.movieId?.title || "N/A"}</p>
                      </div>
                    </td>

                    {/* Rạp & Suất chiếu (DỮ LIỆU MỚI THÊM) */}
                    <td className="bg-slate-50 border-y-2 border-slate-100 p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 font-black text-[10px] uppercase text-amber-600">
                          <MapPin size={12} strokeWidth={3} /> {booking.cinemaName || "Rạp Luna"}
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 uppercase italic">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {booking.showDate}</span>
                          <span className="flex items-center gap-1 text-black"><Clock size={10} /> {booking.showTime}</span>
                        </div>
                      </div>
                    </td>

                    {/* Ghế */}
                    <td className="bg-slate-50 border-y-2 border-slate-100 p-4">
                      <div className="flex flex-wrap gap-1 max-w-[80px]">
                        {booking.seats?.map(seat => (
                          <span key={seat} className="bg-black text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="bg-slate-50 border-y-2 border-slate-100 p-4 font-black text-sm italic">
                      {booking.totalAmount?.toLocaleString()}đ
                    </td>

                    {/* Trạng thái */}
                    <td className="bg-slate-50 border-y-2 border-slate-100 p-4 text-center">
                       <StatusBadge status={booking.status} />
                    </td>

                    {/* Ngày mua hàng */}
                    <td className="bg-slate-50 border-y-2 border-r-2 border-slate-100 p-4 rounded-r-2xl text-right text-[10px] font-black text-slate-400">
                       {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active = false, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-black text-sm uppercase border-2
          ${active 
            ? "bg-amber-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1" 
            : "text-slate-400 border-transparent hover:text-black hover:bg-white hover:border-slate-200"}`}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {active && <ChevronRight size={14} strokeWidth={3} />}
      </button>
    );
}
  
function StatusBadge({ status }) {
    const config = {
      confirmed: { color: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: <CheckCircle2 size={12} />, text: "Đã xác nhận" },
      pending: { color: "bg-amber-100 text-amber-600 border-amber-200", icon: <Clock size={12} />, text: "Chờ xử lý" },
      cancelled: { color: "bg-red-100 text-red-600 border-red-200", icon: <XCircle size={12} />, text: "Đã hủy" },
    };
    const { color, icon, text } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase ${color}`}>
        {icon} {text}
      </span>
    );
}