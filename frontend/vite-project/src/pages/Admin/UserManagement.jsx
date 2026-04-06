import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users, Search, Phone, Mail, Ticket, Trash2, Settings, Loader2, Moon,
  LayoutDashboard, Film, ChevronRight, LogOut
} from "lucide-react";

import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function UserManagement() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { users, fetchUsers, loading, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Chắc chắn gọi fetch khi component load
  useEffect(() => {
    fetchUsers();
  }, []); // Để mảng rỗng để chỉ gọi 1 lần khi mount

  // 2. Logic Filter an toàn
  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    if (!user) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const name = user.displayName?.toLowerCase() || "";
    const phone = user.phone || "";
    const email = user.email?.toLowerCase() || "";

    return name.includes(searchLower) || phone.includes(searchTerm) || email.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 flex font-sans antialiased">
      {/* SIDEBAR (Giữ nguyên của ông) */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden xl:flex flex-col p-6 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-4 py-8">
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-amber-400 border-[2.5px] border-black p-1.5 -rotate-2 group-hover:rotate-3 group-hover:scale-110 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Moon className="text-black" size={22} fill="currentColor" />
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-2xl font-black tracking-tighter italic uppercase text-black leading-none">Luna<span className="text-amber-500"> Cinema</span></span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Administrator</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Tổng quan" onClick={() => navigate("/admin/dashboard")} />
          <NavItem icon={<Film size={18} />} label="Quản lý phim" onClick={() => navigate("/admin/movies")} />
          <NavItem icon={<Users size={18} />} label="Người dùng" active />
          <NavItem icon={<Ticket size={18} />} label="Lịch chiếu" />
        </nav>
        <div className="mt-auto bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-100/50 transition-colors">
            <LogOut size={14} /> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8FAFC]">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">USER DATABASE</h1>
            <p className="text-slate-400 text-sm font-medium italic uppercase tracking-wider">Quản lý khách hàng & lịch sử vé</p>
          </div>
          <div className="relative flex-1 md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic flex items-center gap-2">
              <Users className="text-amber-500" /> Danh sách hội viên
            </h3>
            <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {filteredUsers.length} Accounts
            </span>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-amber-500">
                <Loader2 className="animate-spin mb-4" size={40} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic tracking-[0.2em]">Synchronizing...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase italic">Không tìm thấy người dùng nào</div>
            ) : (
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em]">
                    <th className="pb-2 px-6 text-left w-16">#</th>
                    <th className="pb-2 text-left">Hội viên</th>
                    <th className="pb-2 text-left">Liên hệ</th>
                    <th className="pb-2 text-center">Vé</th>
                    <th className="pb-2 text-right px-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id?.toString() || index} className="group">
                      <td className="py-5 text-center bg-slate-50 group-hover:bg-amber-50 rounded-l-3xl font-black text-slate-400 group-hover:text-amber-600 transition-colors">
                        {index + 1}
                      </td>
                      <td className="py-5 px-4 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-200 group-hover:border-black flex items-center justify-center font-black text-slate-500 group-hover:text-black transition-all shadow-sm uppercase">
                            {user.displayName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm uppercase italic tracking-tight leading-none mb-1">
                              {user.displayName || "N/A"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              @{user.username || "no_user"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 bg-slate-50 group-hover:bg-amber-50 transition-colors">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Phone size={14} className="text-amber-500" strokeWidth={2.5} />
                            {user.phone || "Chưa cập nhật"}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 italic">
                            <Mail size={12} strokeWidth={2} />
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 bg-slate-50 group-hover:bg-amber-50 text-center transition-colors">
                        <div className="inline-flex flex-col items-center bg-white px-4 py-1.5 rounded-2xl border border-slate-200 group-hover:border-black transition-all shadow-sm">
                           <span className="font-black text-slate-900 text-sm">{user.bookingHistory?.length || 0}</span>
                           <span className="text-[8px] font-black text-slate-300 uppercase">Vé</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right bg-slate-50 group-hover:bg-amber-50 rounded-r-3xl transition-colors">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-white text-slate-600 hover:bg-amber-400 hover:text-black rounded-xl border border-slate-200 transition-all"><Settings size={16} /></button>
                          <button 
                            onClick={() => window.confirm("Xóa hội viên này?") && deleteUser(user._id)}
                            className="p-2.5 bg-white text-slate-600 hover:bg-red-500 hover:text-white rounded-xl border border-slate-200 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-black text-sm uppercase ${active ? "bg-amber-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1" : "text-slate-400 hover:text-black hover:bg-amber-50"}`}>
      {icon} <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={14} strokeWidth={3} />}
    </button>
  );
}