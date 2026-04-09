import { useState } from "react";
import { MapPin, Phone, Clock, Search, Ticket, Moon, Navigation, Star, Zap } from "lucide-react";
import Navbar1 from "../components/Navbar1";

const regions = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Miền Tây", "Khác"];

const generateCinemas = () => {
  const baseCinemas = [
    { city: "Hồ Chí Minh", name: "Quận 1", addr: "12 Lê Thánh Tôn, Bến Nghé" },
    { city: "Hà Nội", name: "Hồ Gươm", addr: "01 Tràng Tiền, Hoàn Kiếm" },
    { city: "Đà Nẵng", name: "Riverside", addr: "Vincom Ngô Quyền" },
    { city: "Miền Tây", name: "Ninh Kiều", addr: "02 Hùng Vương, Cần Thơ" },
  ];
  
  return Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    // Đổi tên thành "Rạp + Tên"
    name: `Rạp ${baseCinemas[i % 4].name} #${Math.floor(i/4) + 1}`,
    address: baseCinemas[i % 4].addr,
    city: baseCinemas[i % 4].city,
    phone: `1900.${1000 + i}`,
    // Sử dụng từ khóa cinema để lấy hình ảnh rạp chiếu phim thực tế
    image: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600&seed=${i}`,
    facilities: i % 3 === 0 ? ["IMAX", "4DX"] : ["Gold Class", "Dolby"]
  }));
};

const allCinemas = generateCinemas();

export default function CinemasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filteredCinemas = allCinemas.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === "Tất cả" || c.city === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#1a1a1a] font-sans">
      <Navbar1 />

      {/* Hero Section - Cập nhật Brand Name */}
      <div className="pt-24 pb-12 bg-amber-400 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-black text-white px-3 py-1 w-fit text-[10px] font-black uppercase tracking-widest">
                <Zap size={12} fill="currentColor" /> LUNA CINEMA NETWORK
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8]">
                LUNA <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">CINEMA</span>
              </h1>
            </div>
            
            <div className="w-full md:w-96">
              <div className="relative flex items-center shadow-[6px_6px_0_0_#000] bg-white border-4 border-black">
                <Search className="absolute left-4 text-black" size={20} strokeWidth={3} />
                <input
                  type="text"
                  placeholder="TÌM KIẾM CHI NHÁNH..."
                  className="w-full p-4 pl-12 font-black uppercase text-xs outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Điều Hướng Khu Vực */}
      <div className="bg-white border-b-4 border-black sticky top-[64px] z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-3">
            {regions.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 border-2 border-black font-black text-[11px] uppercase whitespace-nowrap transition-all
                  ${activeTab === tab 
                    ? "bg-black text-white shadow-none translate-x-1 translate-y-1" 
                    : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:bg-amber-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCinemas.map((cinema) => (
            <div 
              key={cinema.id}
              className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col group"
            >
              {/* Image Box - Cinema Themed */}
              <div className="h-48 border-b-4 border-black overflow-hidden relative">
                <img 
                  src={cinema.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={cinema.name} 
                />
                <div className="absolute top-4 right-4 bg-white border-2 border-black px-2 py-1 flex items-center gap-1">
                  <Star size={12} fill="currentColor" className="text-amber-500" />
                  <span className="text-[10px] font-black italic">4.9</span>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-1">
                  {cinema.facilities.map(f => (
                    <span key={f} className="bg-black text-white text-[8px] font-black px-2 py-0.5 border border-white uppercase">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-black uppercase italic mb-3 leading-tight tracking-tighter">
                  {cinema.name}
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex gap-3 items-start group/info">
                    <div className="p-1.5 bg-red-100 border-2 border-black group-hover/info:bg-red-400 transition-colors">
                      <MapPin size={14} strokeWidth={3} />
                    </div>
                    <p className="text-[11px] font-bold text-gray-700 leading-tight uppercase">
                      {cinema.address}, {cinema.city}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-center group/info">
                    <div className="p-1.5 bg-blue-100 border-2 border-black group-hover/info:bg-blue-400 transition-colors">
                      <Phone size={14} strokeWidth={3} />
                    </div>
                    <p className="text-[11px] font-black text-black">
                      {cinema.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-black text-white border-2 border-black py-3 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#fbbf24] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                    <Ticket size={16} /> ĐẶT VÉ NGAY
                  </button>
                  <button className="p-3 border-2 border-black hover:bg-gray-100 transition-colors">
                    <Navigation size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCinemas.length === 0 && (
          <div className="text-center py-32 border-4 border-black border-dashed bg-white">
            <Search size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase text-2xl italic text-gray-400">KHÔNG TÌM THẤY RẠP PHÙ HỢP!</p>
          </div>
        )}
      </main>

      <footer className="py-16 bg-black text-white border-t-8 border-amber-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-400 border-2 border-white rounded-full rotate-12">
               <Moon size={32} fill="black" className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-black italic text-3xl tracking-tighter leading-none">LUNA CINEMA</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase max-w-xs text-center md:text-right">
          © 2026 LUNA CINEMA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}