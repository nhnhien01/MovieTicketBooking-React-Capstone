import Navbar1 from "../components/Navbar1";
import { ChevronLeft } from "lucide-react"; // Import icon mũi tên
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

export default function PrivacyPolicy() {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

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
          Chính sách <span className="text-amber-500">Bảo mật</span>
        </h1>

        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] space-y-8 text-sm font-bold uppercase tracking-tight">
          <section className="border-b-2 border-dashed border-gray-200 pb-6 last:border-0">
            <h2 className="text-2xl font-black mb-3 text-red-600 italic">01. Thu thập thông tin</h2>
            <p className="leading-relaxed">
              Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt vé hoặc đăng ký nhận bản tin qua email. 
              Các dữ liệu bao gồm: Họ tên, Số điện thoại, Email và lịch sử đặt vé.
            </p>
          </section>

          <section className="border-b-2 border-dashed border-gray-200 pb-6 last:border-0">
            <h2 className="text-2xl font-black mb-3 text-red-600 italic">02. Sử dụng thông tin</h2>
            <p className="leading-relaxed">
              Thông tin cá nhân của bạn được sử dụng để xử lý giao dịch vé nhanh chóng, 
              gửi xác nhận mã vé qua SMS/Email và cá nhân hóa trải nghiệm tại rạp LUNA CINEMA.
            </p>
          </section>

          <section className="last:border-0">
            <h2 className="text-2xl font-black mb-3 text-red-600 italic">03. Bảo mật giao dịch</h2>
            <p className="leading-relaxed">
              Mọi giao dịch thanh toán đều được mã hóa qua cổng thanh toán tiêu chuẩn quốc tế. 
              LUNA CINEMA cam kết không lưu trữ thông tin thẻ tín dụng của bạn trên hệ thống.
            </p>
          </section>
        </div>

        {/* Thông báo nhỏ cuối trang */}
        <p className="mt-8 text-[10px] font-black uppercase text-gray-400 text-center tracking-[0.2em]">
          Cập nhật lần cuối: Tháng 4, 2026
        </p>
      </div>
    </div>
  );
}