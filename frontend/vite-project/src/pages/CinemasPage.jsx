import { useState } from "react";
import { MapPin, Phone, Search, Ticket, Moon, Navigation, Star, Zap } from "lucide-react";
import Navbar1 from "../components/Navbar1";

const regions = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Miền Tây", "Khác"];

const generateCinemas = () => {
  const baseCinemas = [
    { city: "Hồ Chí Minh", name: "Premium Quận 1", addr: "12 Lê Thánh Tôn, Bến Nghé" },
    { city: "Hà Nội", name: "Hồ Gươm VIP", addr: "01 Tràng Tiền, Hoàn Kiếm" },
    { city: "Đà Nẵng", name: "Riverside Luxe", addr: "Vincom Ngô Quyền" },
    { city: "Miền Tây", name: "Ninh Kiều Diamond", addr: "02 Hùng Vương, Cần Thơ" },
  ];
  
  return Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    name: `LUNA ${baseCinemas[i % 4].name} #${Math.floor(i/4) + 1}`,
    address: baseCinemas[i % 4].addr,
    city: baseCinemas[i % 4].city,
    phone: `1900.${1000 + i}`,
    image: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600&seed=${i}`,
    facilities: i % 3 === 0 ? ["IMAX", "4DX"] : ["Gold Class", "Dolby Atmos"]
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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-amber-500 selection:text-white">
      <Navbar1 />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-[#fcfcfc] border-b border-gray-100">
        <div className="absolute inset-0 opacity-5 mix-blend-multiply">
            <img src="https://images.unsplash.com/photo-1517604401119-2b02704520cc?auto=format&fit=crop&q=80&w=1200" alt="bg" className="w-full h-full object-cover grayscale" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                <Zap size={14} fill="currentColor" /> Luna Cinema Network
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none text-black">
                HỆ THỐNG <span className="text-amber-500">RẠP CHIẾU</span>
              </h1>
              <p className="text-gray-500 max-w-lg text-lg">Tìm kiếm chi nhánh gần nhất và trải nghiệm công nghệ điện ảnh đỉnh cao tại Luna.</p>
            </div>
            
            <div className="w-full md:w-[450px]">
              <div className="relative flex items-center group">
                <Search className="absolute left-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Tên rạp, thành phố, địa chỉ..."
                  className="w-full p-5 pl-14 bg-white border border-gray-200 rounded-2xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all text-sm font-medium shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar justify-center md:justify-start">
          {regions.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                ${activeTab === tab 
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105" 
                  : "text-gray-500 hover:text-black hover:bg-gray-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCinemas.map((cinema) => (
            <div 
              key={cinema.id}
              className="bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-amber-500/50 transition-all duration-500 group flex flex-col shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.15)]"
            >
              {/* Image Box */}
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={cinema.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={cinema.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-gray-100 shadow-sm">
                  <Star size={14} fill="#f59e0b" className="text-amber-500" />
                  <span className="text-xs font-black text-black">4.9</span>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  {cinema.facilities.map(f => (
                    <span key={f} className="bg-amber-50 text-amber-700 text-[9px] font-black px-2 py-1 rounded border border-amber-100 uppercase">
                      {f}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-bold italic uppercase tracking-tighter mb-4 text-black group-hover:text-amber-500 transition-colors">
                  {cinema.name}
                </h3>
                
                <div className="space-y-4 mb-8 text-gray-500">
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <MapPin size={18} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {cinema.address}, <br/> {cinema.city}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                      <Phone size={18} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-black text-gray-900 tracking-wider">
                      {cinema.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                    <Ticket size={18} /> ĐẶT VÉ NGAY
                  </button>
                  <button className="p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-amber-500 hover:text-black transition-all">
                    <Navigation size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer đồng bộ màu Amber-500 */}
      <footer className="py-20 bg-black border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-500 rounded-2xl rotate-3 shadow-xl shadow-amber-500/20">
                <Moon size={32} fill="black" className="text-black" />
            </div>
            <div>
              <span className="block font-black italic text-4xl tracking-tighter leading-none text-amber-500">LUNA CINEMA</span>
              
            </div>
          </div>
          <div className="text-center md:text-right text-gray-500">
             <p className="text-[11px] font-bold uppercase tracking-widest mb-2">
                © 2026 LUNA CINEMA. ALL RIGHTS RESERVED.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}