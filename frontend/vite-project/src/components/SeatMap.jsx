import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, CreditCard, Loader2, Ticket } from "lucide-react";

export default function SeatMap({ movie, onClose }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const rows = ["A", "B", "C", "D", "E"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const SEAT_PRICE = 95000;
  const lang = localStorage.getItem("app_lang") || "vi";

  const toggleSeat = (id) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSeats.length * SEAT_PRICE;

  const handleMockPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="relative w-full bg-[#fdfcf0] border-[4px] border-black rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-hidden">
      
      {/* NÚT ĐÓNG */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[100] p-2 bg-white border-2 border-black rounded-xl hover:bg-amber-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        <X size={20} className="text-black" strokeWidth={3} />
      </button>

      <div className="py-10 px-8 flex flex-col items-center overflow-y-auto overflow-x-hidden">
        
        {/* PROGRESS BAR */}
        <div className="mb-10 text-center w-full">
          <p className="text-black text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">
            {lang === "vi" ? "TIẾN TRÌNH ĐẶT VÉ" : "BOOKING PROGRESS"}
          </p>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full border-2 border-black transition-all duration-500 ${
                  step >= s ? "bg-amber-400 w-16" : "bg-black/10 w-12"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-3xl font-black italic text-black uppercase mb-10 tracking-tighter">
                {movie?.title}
              </h2>
              
              {/* SCREEN */}
              <div className="relative w-full max-w-[400px] mb-16">
                <div className="w-full h-[6px] bg-black rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.1)]"></div>
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                  {lang === "vi" ? "MÀN HÌNH" : "SCREEN"}
                </p>
              </div>

              {/* SEAT GRID */}
              <div className="grid gap-4 mb-12 w-full justify-center">
                {rows.map((row) => (
                  <div key={row} className="flex gap-3 items-center">
                    <span className="w-6 text-xs font-black text-black/20 italic">{row}</span>
                    {cols.map((col) => {
                      const id = `${row}${col}`;
                      const isSelected = selectedSeats.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleSeat(id)}
                          className={`w-9 h-9 md:w-10 md:h-10 border-2 border-black rounded-xl font-black text-xs transition-all
                            ${isSelected 
                              ? "bg-black text-amber-400 shadow-none translate-y-1" 
                              : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-50 hover:-translate-y-0.5 active:shadow-none active:translate-y-1"}`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* FOOTER CHỌN GHẾ */}
              <div className="w-full border-t-4 border-black border-dashed pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                    {lang === "vi" ? "Số ghế: " : "Seats: "} 
                    <b className="text-black">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "---"}</b>
                  </span>
                  <h3 className="text-4xl font-black italic text-black mt-1">
                    {totalPrice.toLocaleString()}đ
                  </h3>
                </div>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full md:w-auto bg-black text-amber-400 px-12 py-5 border-2 border-black rounded-2xl font-black uppercase text-sm shadow-[6px_6px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  {lang === "vi" ? "TIẾP TỤC" : "CONTINUE"}
                </button>
              </div>
            </motion.div>
          )}

          {/* CÁC BƯỚC 2 VÀ 3 (XÁC NHẬN & THÀNH CÔNG) GIỮ NGUYÊN LOGIC NHƯ TRƯỚC NHƯNG CÓ THỂ CĂN CHỈNH LẠI UI TƯƠNG TỰ */}
          {step === 2 && (
             <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
                <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[10px_10px_0px_0px_#000]">
                  <div className="flex flex-col items-center mb-8">
                    <div className="p-5 bg-amber-400 rounded-2xl mb-4 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <CreditCard size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Thanh toán</h3>
                  </div>
                  <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl border-2 border-black border-dashed">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-black/40 uppercase text-[10px]">Ghế</span>
                      <span className="font-black text-lg">{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-black/5">
                      <span className="font-black uppercase text-xs">Tổng cộng</span>
                      <span className="font-black text-2xl text-amber-600">{totalPrice.toLocaleString()}đ</span>
                    </div>
                  </div>
                  <button
                    onClick={handleMockPayment}
                    disabled={loading}
                    className="w-full py-5 bg-black text-white border-2 border-black rounded-2xl font-black uppercase text-sm shadow-[6px_6px_0_0_#fbbf24] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : "XÁC NHẬN NGAY"}
                  </button>
                </div>
             </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-6">
               <div className="w-24 h-24 bg-green-400 border-4 border-black rounded-3xl flex items-center justify-center shadow-[8px_8px_0px_0px_#000] mb-8 rotate-6">
                 <CheckCircle size={48} className="text-white" strokeWidth={3} />
               </div>
               <h2 className="text-4xl font-black uppercase italic mb-3 tracking-tighter">XONG RỒI!</h2>
               <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-10 italic">Hẹn gặp bạn tại rạp LUNA Cinema nhé</p>
               <button
                 onClick={onClose}
                 className="bg-black text-white px-14 py-5 rounded-2xl border-2 border-black font-black uppercase text-sm shadow-[6px_6px_0_0_#fbbf24] hover:shadow-none hover:translate-y-1 transition-all"
               >
                 ĐÓNG CỬA SỔ
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}