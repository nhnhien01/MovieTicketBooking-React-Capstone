import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Moon, User, Lock, ArrowRight, Eye, EyeOff, Sparkles, Home, Mail } from "lucide-react";

const NeoInput = ({ icon: Icon, label, error, register, name, rules, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex justify-between">
      {label}
      {error && <span className="text-red-500 italic text-[9px]">bắt buộc *</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors">
        <Icon size={16} />
      </div>
      <input 
        {...register(name, rules)} 
        {...props}
        className={`w-full bg-gray-50 border-[3px] ${error ? 'border-red-500' : 'border-gray-900'} h-11 pl-11 pr-4 rounded-xl font-bold text-sm text-gray-800 outline-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 focus:bg-white`} 
      />
    </div>
  </div>
);

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Lấy user từ store để kiểm tra trạng thái
  const { signIn, signUp, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Logic 1: Nếu đã có user (đã đăng nhập) thì tự động đẩy ra khỏi trang Login
  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get("redirect") || "/";
      navigate(redirectPath);
    }
  }, [user, navigate, location.search]);

  useEffect(() => {
    if (location.state?.initialRegister) {
      setIsRegister(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    const res = isRegister ? await signUp(data) : await signIn(data);
    
    if (res.success) {
      toast.success(res.message || "Xác thực thành công!");
      
      if (isRegister) { 
        setIsRegister(false); 
        reset(); 
      } else {
        // --- QUAN TRỌNG: Chuyển hướng ngay sau khi đăng nhập thành công ---
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get("redirect") || "/";
        
        // Đợi 1 chút để toast kịp hiện hoặc navigate luôn
        navigate(redirectPath);
      }
    } else {
      toast.error(res.message || "Thông tin không hợp lệ");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f0] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Nút Quay về */}
      <div className="fixed top-8 left-8 z-50">
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-white border-[3px] border-gray-900 px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
        >
          <Home size={18} strokeWidth={2.5} className="text-gray-900" />
          <span className="text-[11px] font-black uppercase tracking-widest italic hidden md:block">
            Trang chủ
          </span>
        </motion.button>
      </div>

      <div className="absolute top-20 -left-20 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <motion.div 
        layout
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[420px] z-20"
      >
        <div className="bg-white border-[4px] border-gray-900 p-8 md:p-9 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
          
          <div className="text-center mb-9">
            <motion.div 
              layout
              className="inline-block w-14 h-14 bg-amber-400 border-[3px] border-gray-900 rounded-2xl flex items-center justify-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-4"
            >
              <Moon className="text-gray-900" size={28} fill="currentColor" />
            </motion.div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
              Luna<span className="text-amber-500"> Cinema</span>
            </h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.25em] mt-3">Hệ thống đặt vé trực tuyến</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isRegister && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <NeoInput 
                    icon={Sparkles} label="Họ và tên" name="displayName" 
                    register={register} error={errors.displayName}
                    rules={{ required: isRegister }} placeholder="VD: Nguyễn Văn An" 
                  />
                  <NeoInput 
                    icon={Mail} label="Địa chỉ Email" name="email" type="email" 
                    register={register} error={errors.email}
                    rules={{ required: isRegister }} placeholder="an.nguyen@example.com" 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <NeoInput 
              icon={User} label="Tên đăng nhập" name="username" 
              register={register} error={errors.username}
              rules={{ required: true }} placeholder="Nhập tài khoản" 
            />

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex justify-between">
                Mật khẩu
                {errors.password && <span className="text-red-500 text-[9px]">bắt buộc *</span>}
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600">
                  <Lock size={16} />
                </div>
                <input 
                  {...register("password", { required: true })} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border-[3px] border-gray-900 h-11 pl-11 pr-11 rounded-xl font-bold text-sm text-gray-800 outline-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-gray-900 text-amber-400 rounded-xl font-black uppercase text-xs tracking-widest shadow-[5px_5px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2.5 mt-4"
            >
              {isRegister ? "Hoàn tất đăng ký" : "Đăng nhập ngay"} <ArrowRight size={18} strokeWidth={3} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 text-center">
            <button 
              onClick={() => { setIsRegister(!isRegister); reset(); }} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-amber-600 transition-all border-b-2 border-amber-400 pb-0.5"
            >
              {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký ngay"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}