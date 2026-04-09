import Navbar1 from "../components/Navbar1";
import { Phone, Mail, ChevronLeft } from "lucide-react"; // Import thêm icon ChevronLeft
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function CustomerCare() {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-gray-900 font-sans pt-32 pb-20 px-6">
      <Navbar1 />
      
      <div className="max-w-4xl mx-auto">
        {/* Nút Quay Lại */}
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 mb-8 font-black uppercase italic text-sm border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </button>

        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-10 border-b-8 border-black pb-4">
          Chăm sóc <span className="text-red-600">Khách hàng</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-amber-400 border-4 border-black p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-black mb-6 uppercase italic">Liên hệ ngay</h2>
            <div className="space-y-6 font-bold">
              <div className="flex items-center gap-4">
                <div className="bg-black text-white p-2 border-2 border-black">
                  <Phone size={24}/>
                </div>
                <span className="text-xl">1900 5199</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-black text-white p-2 border-2 border-black">
                  <Mail size={24}/>
                </div>
                <span className="break-all">SUPPORT@LUNACINEMA.VN</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] flex flex-col justify-center">
            <h3 className="font-black uppercase mb-4 italic">Thời gian làm việc</h3>
            <p className="font-bold uppercase text-2xl tracking-tighter">8:00 AM - 11:00 PM</p>
            <p className="text-xs font-bold text-gray-500 mt-2">(Tất cả các ngày trong tuần)</p>
          </div>
        </div>
      </div>
    </div>
  );
}