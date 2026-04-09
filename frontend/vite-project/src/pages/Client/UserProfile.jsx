import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Calendar, LogOut, 
  Camera, Edit3, Save, X, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../api/axiosClient.js";
import BookingHistory from "./BookingHistory";

export default function UserProfile() {
  const { authUser, checkAuth, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("info"); 
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
  });

  // Đồng bộ dữ liệu người dùng vào form khi component mount hoặc authUser thay đổi
  useEffect(() => {
    if (authUser) {
      setFormData({
        displayName: authUser.displayName || "",
        phone: authUser.phone || "",
      });
    }
  }, [authUser]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("profilePic", file);
    try {
      setLoading(true);
      await axiosClient.put("/auth/update-profile", data);
      toast.success("Cập nhật ảnh đại diện thành công!");
      await checkAuth();
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await axiosClient.put("/auth/update-profile", {
        displayName: formData.displayName,
        phone: formData.phone
      });
      toast.success("Hồ sơ đã được làm mới!");
      await checkAuth();
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fdfcf0]">
        <Loader2 className="animate-spin text-amber-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf0] pt-24 pb-20 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
              Thông tin tài khoản
            </h1>
          </motion.div>

          <div className="flex p-1 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button 
              onClick={() => setActiveTab("info")} 
              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'info' ? 'bg-amber-400 text-black' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Hồ sơ người dùng
            </button>
            <button 
              onClick={() => setActiveTab("history")} 
              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'history' ? 'bg-amber-400 text-black' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Lịch sử đặt vé
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Mini Avatar Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border-[3px] border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-28">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div className="w-28 h-28 rounded-[1.8rem] border-[3px] border-black overflow-hidden bg-amber-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <img 
                      src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.username}&background=random`} 
                      className="w-full h-full object-cover" 
                      alt="avatar"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-[1.8rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <h2 className="mt-4 text-xl font-black italic">@{authUser.username}</h2>
                <div className="mt-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg">
                  {authUser.role || "Thành viên"}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                 <button onClick={logout} className="w-full py-3 bg-rose-50 text-rose-600 border-2 border-rose-600 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all">
                    <LogOut size={14} /> Thoát ứng dụng
                 </button>
              </div>
            </div>
          </div>

          {/* Cột phải: Nội dung chính */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "info" ? (
                <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  
                  <div className="bg-white border-[3px] border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black italic flex items-center gap-2">
                        <User size={20} className="text-amber-500" /> Thông tin chi tiết
                      </h3>
                      <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-slate-50 border-2 border-black rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-amber-400 transition-colors">
                        {isEditing ? <><X size={14}/> Hủy bỏ</> : <><Edit3 size={14}/> Sửa hồ sơ</>}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Tên hiển thị */}
                      <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mb-2">
                          <User size={14}/> Họ và Tên
                        </label>
                        {isEditing ? (
                          <input 
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className="w-full bg-white px-3 py-2 rounded-lg border-2 border-black font-bold text-slate-800 outline-none"
                          />
                        ) : (
                          <p className="font-bold text-slate-700 ml-1">{authUser.displayName || "Chưa thiết lập"}</p>
                        )}
                      </div>

                      {/* Số điện thoại */}
                      <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mb-2">
                          <Phone size={14}/> Số điện thoại
                        </label>
                        {isEditing ? (
                          <input 
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-white px-3 py-2 rounded-lg border-2 border-black font-bold text-slate-800 outline-none"
                          />
                        ) : (
                          <p className="font-bold text-slate-700 ml-1">{authUser.phone || "Chưa thiết lập"}</p>
                        )}
                      </div>

                      {/* Email - Read Only */}
                      <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/30 opacity-80">
                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mb-2">
                          <Mail size={14}/> Địa chỉ Email
                        </label>
                        <p className="font-bold text-slate-500 ml-1 italic">{authUser.email}</p>
                      </div>

                      {/* Ngày gia nhập - Read Only */}
                      <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/30 opacity-80">
                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mb-2">
                          <Calendar size={14}/> Ngày gia nhập
                        </label>
                        <p className="font-bold text-slate-500 ml-1 italic">
                          {new Date(authUser.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {isEditing && (
                      <motion.button 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={handleUpdateProfile} 
                        disabled={loading} 
                        className="mt-6 w-full py-4 bg-slate-900 text-amber-400 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Lưu hồ sơ mới
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <BookingHistory />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}