import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Loader2, MapPin, ChevronRight, Search, Zap, Calendar, Clock } from "lucide-react";
import axiosClient from "../api/axiosClient"; 
import { toast } from "sonner"; // Hoặc alert bình thường nếu bạn không dùng sonner

const showTimes = ["09:00", "12:30", "15:45", "19:30", "22:15"];

// Giả lập dữ liệu rạp
const generateCinemas = () => {
  const baseCinemas = [
    { city: "Hồ Chí Minh", name: "Quận 1", addr: "12 Lê Thánh Tôn, Bến Nghé" },
    { city: "Hà Nội", name: "Hồ Gươm", addr: "01 Tràng Tiền, Hoàn Kiếm" },
    { city: "Đà Nẵng", name: "Riverside", addr: "Vincom Ngô Quyền" },
    { city: "Miền Tây", name: "Ninh Kiều", addr: "02 Hùng Vương, Cần Thơ" },
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Rạp ${baseCinemas[i % 4].name} #${Math.floor(i/4) + 1}`,
    address: baseCinemas[i % 4].addr,
    city: baseCinemas[i % 4].city,
  }));
};

const allCinemas = generateCinemas();

export default function SeatMap({ movie, onClose }) {
  const [step, setStep] = useState(0); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const SEAT_PRICE = 95000;

  const filteredCinemas = useMemo(() => {
    return allCinemas.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleSeat = (id) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSeats.length * SEAT_PRICE;

  // HÀM XỬ LÝ THANH TOÁN QUAN TRỌNG
 const handlePayment = async () => {
    // 1. Lấy user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")); 
    
    // Kiểm tra đăng nhập
    if (!storedUser || !storedUser._id) {
      toast.error("Vui lòng đăng nhập để đặt vé!");
      return;
    }

    // 2. Kiểm tra dữ liệu đầu vào (Validation)
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế!");
      return;
    }
    
    if (!selectedCinema || !selectedTime || !selectedDate) {
      toast.error("Vui lòng chọn đầy đủ rạp, ngày và suất chiếu!");
      return;
    }

    // 3. Kiểm tra thông tin phim (movieId)
    if (!movie?._id) {
      toast.error("Không tìm thấy ID phim. Vui lòng thử lại!");
      return;
    }

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi đi (Payload)
      // Lưu ý: Tên các thuộc tính phải khớp 100% với req.body ở Backend
      const bookingData = {
        userId: storedUser._id,
        movieId: movie._id,
        cinemaName: selectedCinema.name,
        seats: selectedSeats,
        totalAmount: totalPrice,
        showDate: selectedDate, // Dạng YYYY-MM-DD từ input date (Backend sẽ nhận chuỗi này)
        showTime: selectedTime,
        status: 'confirmed'
      };

      console.log("Đang gửi dữ liệu đặt vé:", bookingData);

      const res = await axiosClient.post("/bookings", bookingData);

      // Nếu thành công (Status 200 hoặc 201)
      if (res.status === 201 || res.status === 200) {
        toast.success("Đặt vé thành công!");
        setStep(3); // Chuyển sang màn hình "Xong rồi!"
      }
    } catch (error) {
      // Log lỗi chi tiết từ Server trả về để dễ debug
      const serverError = error.response?.data?.message || error.response?.data?.error;
      console.error("Lỗi đặt vé từ Server:", serverError || error.message);
      
      toast.error(serverError || "Đặt vé thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-[#fdfcf0] border-[4px] border-black rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-hidden">
      {/* Nút đóng */}
      <button onClick={onClose} className="absolute top-6 right-6 z-[100] p-2 bg-white border-2 border-black rounded-xl hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
        <X size={20} strokeWidth={3} />
      </button>

      <div className="py-10 px-6 md:px-8 flex flex-col items-center overflow-y-auto no-scrollbar">
        {/* Thanh tiến trình */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 0.5, 1, 2].map((s, idx) => (
            <div key={idx} className={`h-1.5 rounded-full border-2 border-black transition-all ${step >= s ? "bg-amber-400 w-10" : "bg-black/10 w-6"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* BƯỚC 0: CHỌN RẠP */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg">
              <h2 className="text-3xl font-black italic uppercase text-center mb-6">CHỌN RẠP</h2>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                <input type="text" placeholder="Tìm rạp hoặc thành phố..." className="w-full p-4 pl-12 border-[3px] border-black rounded-2xl font-bold" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar border-t-2 border-black/5 pt-4">
                {filteredCinemas.map((cinema) => (
                  <button key={cinema.id} onClick={() => { setSelectedCinema(cinema); setStep(0.5); }} className="flex items-center justify-between p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] hover:bg-amber-400 transition-all">
                    <div className="text-left">
                      <p className="font-black uppercase text-xs">{cinema.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{cinema.city}</p>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* BƯỚC 0.5: CHỌN NGÀY & GIỜ */}
          {step === 0.5 && (
            <motion.div key="step05" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">LỊCH CHIẾU</h2>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{selectedCinema?.name}</p>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase mb-2 ml-2 text-black/40">Ngày xem</p>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                    <input 
                        type="date" 
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-4 pl-12 bg-white border-[3px] border-black rounded-2xl font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
                    />
                </div>
              </div>

              <p className="text-[10px] font-black uppercase mb-2 ml-2 text-black/40">Suất chiếu</p>
              <div className="grid grid-cols-3 gap-3 mb-10">
                {showTimes.map((t) => (
                  <button key={t} onClick={() => setSelectedTime(t)} className={`p-4 border-2 border-black rounded-xl font-black text-sm transition-all ${selectedTime === t ? "bg-black text-amber-400" : "bg-white shadow-[4px_4px_0px_0px_#000]"}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(0)} className="flex-1 px-6 py-4 border-2 border-black rounded-xl font-black uppercase text-[10px]">Trở lại</button>
                <button disabled={!selectedTime} onClick={() => setStep(1)} className="flex-[2] bg-black text-amber-400 px-8 py-4 border-2 border-black rounded-xl font-black uppercase text-[10px] shadow-[4px_4px_0_0_#fbbf24] disabled:opacity-20">Chọn ghế</button>
              </div>
            </motion.div>
          )}

          {/* BƯỚC 1: SƠ ĐỒ GHẾ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">{movie?.title}</h2>
                <p className="text-[10px] font-black uppercase text-amber-600 mt-2">
                    {selectedCinema?.name} • {new Date(selectedDate).toLocaleDateString('vi-VN')} • {selectedTime}
                </p>
              </div>
              
              <div className="grid gap-2 mb-10">
                {rows.map((row) => (
                  <div key={row} className="flex gap-2 items-center">
                    <span className="w-4 text-[10px] font-black text-black/20 italic">{row}</span>
                    {cols.map((col) => {
                      const id = `${row}${col}`;
                      const isSelected = selectedSeats.includes(id);
                      return (
                        <button key={id} onClick={() => toggleSeat(id)} className={`w-8 h-8 border-2 border-black rounded-lg font-black text-[10px] transition-all ${isSelected ? "bg-black text-amber-400 shadow-none" : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"}`}>
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="w-full border-t-2 border-black border-dashed pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Ghế: <span className="text-black">{selectedSeats.join(", ")}</span></p>
                  <h3 className="text-3xl font-black italic">{totalPrice.toLocaleString()}đ</h3>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => setStep(0.5)} className="flex-1 px-6 py-4 border-2 border-black rounded-xl font-black uppercase text-[10px]">Trở lại</button>
                    <button disabled={selectedSeats.length === 0} onClick={() => setStep(2)} className="flex-[2] bg-black text-amber-400 px-8 py-4 border-2 border-black rounded-xl font-black uppercase text-[10px] shadow-[4px_4px_0_0_#fbbf24]">Thanh toán</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* BƯỚC 2: XÁC NHẬN & GỬI API */}
          {step === 2 && (
            <motion.div key="step2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
              <div className="bg-white border-[3px] border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_#000]">
                <h3 className="text-xl font-black uppercase italic mb-4 text-center">HÓA ĐƠN VÉ</h3>
                <div className="bg-amber-50 p-4 rounded-xl border-2 border-black border-dashed space-y-3 mb-6 font-bold text-[10px] uppercase">
                  <div className="flex justify-between"><span>Phim</span><span className="text-amber-600">{movie.title}</span></div>
                  <div className="flex justify-between"><span>Rạp</span><span>{selectedCinema?.name}</span></div>
                  <div className="flex justify-between"><span>Lịch</span><span>{new Date(selectedDate).toLocaleDateString('vi-VN')} | {selectedTime}</span></div>
                  <div className="flex justify-between border-t-2 border-black pt-3 text-sm"><span>Tổng tiền</span><span className="text-xl font-black">{totalPrice.toLocaleString()}đ</span></div>
                </div>
                
                <button 
                  disabled={loading}
                  onClick={handlePayment} 
                  className="w-full py-4 bg-black text-white border-2 border-black rounded-xl font-black uppercase text-xs shadow-[4px_4px_0_0_#fbbf24] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><Zap size={14} fill="currentColor" /> XÁC NHẬN THANH TOÁN</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* BƯỚC 3: THÀNH CÔNG */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
              <div className="w-20 h-20 bg-green-400 border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_#000] mb-6 rotate-3">
                <CheckCircle size={40} className="text-white" strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-2">XONG RỒI!</h2>
              <p className="font-bold text-gray-500 text-[10px] uppercase mb-8">Vé đã được lưu vào lịch sử của bạn.</p>
              <button onClick={onClose} className="bg-black text-white px-10 py-4 rounded-xl border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_0_#fbbf24]">ĐÓNG</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}