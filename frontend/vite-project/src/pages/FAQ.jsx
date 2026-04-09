import Navbar1 from "../components/Navbar1";
import { ChevronLeft } from "lucide-react"; // Import icon mũi tên
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

const faqs = [
  { q: "Làm sao để đặt vé online?", a: "Bạn chỉ cần chọn phim, chọn suất chiếu và chỗ ngồi, sau đó thanh toán qua thẻ hoặc ví điện tử." },
  { q: "Tôi có thể hoàn vé không?", a: "Vé đã mua không thể hoàn trả, nhưng bạn có thể đổi suất chiếu trước 2 tiếng tại rạp." },
  { q: "Trẻ em bao nhiêu tuổi cần mua vé?", a: "Trẻ em cao từ 1m trở lên bắt buộc phải mua vé." }
];

export default function FAQ() {
  const navigate = useNavigate(); // Khởi tạo điều hướng

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans pt-32 pb-20 px-6">
      <Navbar1 />
      
      <div className="max-w-4xl mx-auto">
        {/* Nút Quay Lại Style Retro */}
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 mb-8 font-black uppercase italic text-sm border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </button>

        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-10 border-b-8 border-black pb-4">
          CÂU HỎI <span className="text-amber-500">THƯỜNG GẶP</span>
        </h1>

        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-black p-6 shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-transform group cursor-default"
            >
              <h3 className="text-lg font-black uppercase mb-2 text-red-600 italic flex gap-3">
                <span className="text-black not-italic">?</span> {item.q}
              </h3>
              <p className="font-bold text-sm uppercase tracking-tight text-gray-600 pl-6 border-l-2 border-gray-200">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        {/* Banner nhỏ trang trí cuối trang (Tùy chọn) */}
        <div className="mt-12 bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0_0_#fbbf24]">
            <p className="font-black italic uppercase text-center tracking-widest">
                Vẫn còn thắc mắc? Liên hệ hotline 1900 5199
            </p>
        </div>
      </div>
    </div>
  );
}