import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Phone, Mail, Trash2, Loader2, Moon,
  LayoutDashboard, ChevronRight, LogOut, Calendar, ShieldCheck,
  UserCheck, Award, Home, ArrowLeft, MapPin, CalendarCheck
} from "lucide-react";

import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function UserManagement() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { users, fetchUsers, loading, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    if (!user) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      {/* SIDEBAR - Đồng bộ với Dashboard */}
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
            onClick={() => navigate("/admin/dashboard")}
          />
          <NavItem 
            icon={<MapPin size={18} />} 
            label="Quản lý rạp" 
            onClick={() => navigate("/admin/dashboard")} // Hoặc link rạp của bạn
          />
          <NavItem 
            icon={<CalendarCheck size={18} />} 
            label="Quản lý đặt vé" 
            onClick={() => navigate("/admin/bookings")} 
          />
          
          <div className="pt-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Dữ liệu & Nhân sự</div>
            <NavItem 
              icon={<Users size={18} />} 
              label="Người dùng" 
              active
            />
          </div>
        </nav>

        <div className="mt-auto space-y-3">
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-tight hover:bg-black hover:text-white transition-all shadow-sm border border-slate-200"
          >
            <Home size={16} /> Về trang chủ
          </button>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <LogOut size={14} /> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Nút quay lại Dashboard */}
            <button 
              onClick={() => navigate("/admin/dashboard")} 
              className="flex items-center justify-center w-12 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                User <span className="text-amber-500">Directory</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-bold italic uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <UserCheck size={14} className="text-emerald-500" /> Member Management System
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black focus:ring-4 focus:ring-amber-400/20 transition-all shadow-sm"
            />
          </div>
        </header>

        {/* DATA CONTAINER */}
        <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden min-h-[500px]">
          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">Danh sách hội viên</h3>
            </div>
            
            <div className="bg-black text-white px-5 py-2 rounded-2xl flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[11px] font-black uppercase tracking-wider">{filteredUsers.length} Tài khoản</span>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="animate-spin text-amber-500 relative z-10" size={48} />
                    <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-20 animate-pulse"></div>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic mt-6">Đang đồng bộ dữ liệu...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-32 text-center">
                <div className="inline-block p-6 bg-slate-50 rounded-full mb-4 border-2 border-dashed border-slate-200">
                    <Users size={40} className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-black uppercase italic tracking-widest text-lg">Không tìm thấy kết quả</p>
              </div>
            ) : (
              <div className="overflow-x-auto px-2 pb-6">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="pb-2 px-6 text-center w-20">#No</th>
                      <th className="pb-2 text-left">Người dùng</th>
                      <th className="pb-2 text-left">Liên lạc</th>
                      <th className="pb-2 text-center">Vai trò</th>
                      <th className="pb-2 text-right px-8">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user._id || index} className="group">
                        <td className="py-4 text-center bg-slate-50 border-y-2 border-l-2 border-slate-100 rounded-l-2xl font-black text-slate-400 group-hover:text-black transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        
                        <td className="py-4 px-4 bg-slate-50 border-y-2 border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all uppercase">
                                {user.displayName?.charAt(0) || "U"}
                              </div>
                              {user.role === 'admin' && (
                                <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-lg border border-black shadow-sm">
                                  <Award size={10} className="text-black" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm uppercase italic tracking-tighter group-hover:text-amber-600 transition-colors">
                                {user.displayName || "N/A"}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Calendar size={10} /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 bg-slate-50 border-y-2 border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-700">
                              <Mail size={12} className="text-amber-500" /> {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                              <Phone size={12} /> {user.phone || "---"}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 bg-slate-50 border-y-2 border-slate-100 text-center">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-amber-400 rounded-lg text-[9px] font-black uppercase border border-black shadow-sm">
                              <ShieldCheck size={10} /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-white text-emerald-600 rounded-lg text-[9px] font-black uppercase border-2 border-emerald-100">
                              Member
                            </span>
                          )}
                        </td>

                        <td className="py-4 pr-6 text-right bg-slate-50 border-y-2 border-r-2 border-slate-100 rounded-r-2xl">
                          <div className="flex justify-end gap-2">
                            {user.role !== 'admin' ? (
                              <button 
                                onClick={() => {
                                  if (window.confirm("Xác nhận xóa người dùng này?")) {
                                    deleteUser(user._id);
                                  }
                                }}
                                className="p-2.5 bg-white border-2 border-black hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase italic pr-4 tracking-widest">Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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