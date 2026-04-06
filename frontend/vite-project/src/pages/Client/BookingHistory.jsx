import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Info, Loader2, Search } from "lucide-react";
import axiosClient from "../../api/axiosClient.js";
import { toast } from "sonner";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy lịch sử đặt vé từ Backend của bạn
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Thay đường dẫn này bằng endpoint thật của bạn (ví dụ: /bookings/history)
        const response = await axiosClient.get("/auth/booking-history"); 
        setBookings(response.data || []);
      } catch (error) {
        console.error("Fetch history error:", error);
        toast.error("Không thể tải lịch sử đặt vé");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-black mb-4" size={40} />
        <p className="font-black uppercase italic text-xs tracking-widest">Đang truy xuất dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.length > 0 ? (
        bookings.map((ticket, idx) => (
          <motion.div 
            key={ticket._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-[3px] border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row group"
          >
            {/* Đầu vé (Ticket Stub) */}
            <div className="md:w-48 bg-amber-400 p-8 flex flex-col items-center justify-center border-b-[3px] md:border-b-0 md:border-r-[3px] border-black relative">
               <Ticket size={40} className="group-hover:rotate-12 transition-transform duration-300" />
               <span className="mt-4 font-black text-[10px] italic break-all text-center">
                #{ticket.bookingNumber || ticket._id?.slice(-6).toUpperCase()}
               </span>
               <div className="absolute -top-4 md:top-auto md:-right-4 w-8 h-8 bg-[#fdfcf0] border-[3px] border-black rounded-full"></div>
               <div className="absolute -bottom-4 md:bottom-auto md:-right-4 w-8 h-8 bg-[#fdfcf0] border-[3px] border-black rounded-full"></div>
            </div>

            {/* Thân vé (Ticket Body) */}
            <div className="flex-1 p-8">
              <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                    {ticket.movieTitle || ticket.movie?.title}
                  </h4>
                  <span className={`px-4 py-1 rounded-full border-2 border-black text-[10px] font-black uppercase ${ticket.status === 'Success' || ticket.status === 'Sắp tới' ? 'bg-green-400' : 'bg-gray-100'}`}>
                      {ticket.status}
                  </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase opacity-40 flex items-center gap-1"><Calendar size={10}/> Ngày</span>
                      <p className="font-black text-sm italic">{ticket.showDate}</p>
                  </div>
                  <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase opacity-40 flex items-center gap-1"><Clock size={10}/> Suất</span>
                      <p className="font-black text-sm italic">{ticket.showTime}</p>
                  </div>
                  <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase opacity-40 flex items-center gap-1"><Ticket size={10}/> Ghế</span>
                      <p className="font-black text-sm italic">{ticket.seats?.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase opacity-40 flex items-center gap-1"><MapPin size={10}/> Rạp</span>
                      <p className="font-black text-[10px] italic leading-tight">{ticket.theaterName || "Luna Cinema"}</p>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black border-dashed flex justify-between items-center">
                  <div className="flex items-center gap-2 text-rose-500">
                      <Info size={14} />
                      <span className="text-[10px] font-black uppercase italic">Vui lòng xuất trình mã vé tại quầy</span>
                  </div>
                  <button className="flex items-center gap-2 font-black text-xs uppercase hover:underline underline-offset-4 decoration-amber-500">
                      Chi tiết <ChevronRight size={14} />
                  </button>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        /* GIAO DIỆN TRỐNG (Khi Backend trả về mảng []) */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-24 text-center bg-white border-[3px] border-black rounded-[3rem] border-dashed flex flex-col items-center justify-center"
        >
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center border-[3px] border-black mb-6 rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Ticket size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-2">Chưa có vé nào!</h3>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-8">Bạn chưa thực hiện giao dịch đặt vé nào.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-black text-amber-400 rounded-2xl font-black text-xs uppercase italic flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Search size={16} /> Tìm phim hay ngay
            </button>
        </motion.div>
      )}
    </div>
  );
}