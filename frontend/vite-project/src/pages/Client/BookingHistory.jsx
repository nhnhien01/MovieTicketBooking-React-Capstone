import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Info, Loader2, Search, Film, X } from "lucide-react";
import QRCode from "react-qr-code";
import axiosClient from "../../api/axiosClient.js"; 
import { toast } from "sonner";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        
        // 1. Lấy user từ localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          toast.error("Vui lòng đăng nhập để xem lịch sử");
          setLoading(false);
          return;
        }

        const storedUser = JSON.parse(userData);
        const userId = storedUser?._id || storedUser?.id;

        if (!userId) {
          toast.error("Không tìm thấy ID người dùng");
          setLoading(false);
          return;
        }

        // 2. Gọi API kèm userId qua params
        const response = await axiosClient.get("/bookings/my-history", {
          params: { userId: userId }
        });
        
        // 3. Trích xuất data linh hoạt
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data?.data) {
          data = response.data.data;
        }

        // Sắp xếp vé mới nhất lên đầu (dựa trên createdAt)
        const sortedData = [...data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBookings(sortedData);
      } catch (error) {
        console.error("Lỗi fetch history:", error);
        const msg = error.response?.data?.message || "Không thể tải lịch sử";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-white border-[4px] border-black rounded-[3rem]">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} strokeWidth={3} />
        <p className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Đang truy xuất kho vé...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {bookings.length > 0 ? (
        bookings.map((ticket, idx) => (
          <motion.div 
            key={ticket._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
           
            <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-3 translate-y-3 transition-all group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
            
            <div className="relative bg-white border-[4px] border-black rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[200px]">
              
              {/* PHẦN TRÁI: POSTER PHIM */}
              <div className="md:w-52 bg-zinc-200 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black relative">
                {ticket.movieId?.posterUrl ? (
                   <img src={ticket.movieId.posterUrl} alt="poster" className="w-full h-48 md:h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-400 font-black italic">NO POSTER</div>
                )}
                <div className="absolute top-4 left-4 bg-black text-amber-400 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-amber-400">
                   #{ticket._id?.slice(-6).toUpperCase()}
                </div>
              </div>

              {/* PHẦN PHẢI: CHI TIẾT VÉ */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h4 className="text-2xl font-black uppercase italic leading-none tracking-tighter">
                      {ticket.movieId?.title || "Phim đã xóa"}
                    </h4>
                    <span className="bg-emerald-400 border-[3px] border-black px-4 py-1 rounded-xl text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      Thành công
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><Calendar size={12}/> Ngày</span>
                      <p className="font-black text-xs uppercase italic">{ticket.showDate}</p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><Clock size={12}/> Giờ</span>
                      <p className="font-black text-xs uppercase italic">{ticket.showTime}</p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><Ticket size={12}/> Ghế</span>
                      <p className="font-black text-xs uppercase italic text-rose-500">
                        {Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><MapPin size={12}/> Giá</span>
                      <p className="font-black text-xs uppercase italic">{ticket.totalAmount?.toLocaleString()}đ</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-[3px] border-black border-dashed flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl border-2 border-black">
                    <Info size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase italic text-zinc-500">Dùng mã QR này để vào rạp</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-400 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black text-xs uppercase italic flex items-center justify-center gap-2"
                  >
                    Mở QR CODE <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Lỗ khuyết vé trang trí */}
              <div className="hidden md:block absolute left-[196px] -top-5 w-10 h-10 bg-[#fdfcf0] border-[4px] border-black rounded-full z-10"></div>
              <div className="hidden md:block absolute left-[196px] -bottom-5 w-10 h-10 bg-[#fdfcf0] border-[4px] border-black rounded-full z-10"></div>
            </div>
          </motion.div>
        ))
      ) : (
        <EmptyState />
      )}

      {/* MODAL QR CODE */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8 }}
              className="bg-white border-[6px] border-black p-10 rounded-[4rem] max-w-sm w-full relative shadow-[15px_15px_0px_0px_#fbbf24]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedTicket(null)} className="absolute top-6 right-6 p-2 bg-rose-500 border-2 border-black rounded-full text-white"><X size={20} /></button>
              
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-black uppercase italic leading-none">{selectedTicket.movieId?.title}</h3>
                <div className="bg-white border-[4px] border-black p-4 rounded-3xl inline-block shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <QRCode value={`BOOKING_ID:${selectedTicket._id}`} size={180} />
                </div>
                <div className="space-y-2 pt-4 border-t-2 border-black border-dashed">
                    <p className="text-[10px] font-black uppercase text-zinc-400">Thông tin vé</p>
                    <p className="font-black text-sm italic uppercase">Ghế: {selectedTicket.seats?.join(", ")} | {selectedTicket.showTime}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-zinc-50 border-[5px] border-black rounded-[4rem] border-dashed flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border-[4px] border-black mb-8 -rotate-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"><Ticket size={48} className="text-zinc-300" /></div>
      <h3 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Lịch sử đặt vé trống!</h3>
      <p className="font-bold text-zinc-400 uppercase text-[11px] tracking-widest mb-12">Hãy mua vé và trải nghiệm xem phim tại Luna Cinema</p>
      <button onClick={() => window.location.href = '/'} className="group relative px-12 py-6 font-black text-sm uppercase italic">
        <div className="absolute inset-0 bg-black rounded-2xl"></div>
        <div className="relative bg-amber-400 border-[3px] border-black rounded-2xl px-12 py-5 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all flex items-center gap-3">
          <Search size={22} strokeWidth={3} /> KHÁM PHÁ NGAY
        </div>
      </button>
    </motion.div>
  );
}