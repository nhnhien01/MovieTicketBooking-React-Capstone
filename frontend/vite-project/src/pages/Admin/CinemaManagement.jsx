import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Navigation, 
  ExternalLink,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dữ liệu giả lập (Lấy logic từ CinemasPage của bạn)
const generateCinemas = () => {
  const baseCinemas = [
    { city: "Hồ Chí Minh", name: "Quận 1", addr: "12 Lê Thánh Tôn, Bến Nghé" },
    { city: "Hà Nội", name: "Hồ Gươm", addr: "01 Tràng Tiền, Hoàn Kiếm" },
    { city: "Đà Nẵng", name: "Riverside", addr: "Vincom Ngô Quyền" },
    { city: "Miền Tây", name: "Ninh Kiều", addr: "02 Hùng Vương, Cần Thơ" },
  ];
  
  return Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    name: `Rạp ${baseCinemas[i % 4].name} #${Math.floor(i/4) + 1}`,
    address: baseCinemas[i % 4].addr,
    city: baseCinemas[i % 4].city,
    phone: `1900.${1000 + i}`,
    rooms: 8,
    status: i % 10 === 0 ? "Bảo trì" : "Đang hoạt động"
  }));
};

const initialData = generateCinemas();

export default function CinemaManagement() {
  const [cinemas, setCinemas] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("Tất cả");

  // Logic lọc dữ liệu
  const filteredCinemas = cinemas.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = filterCity === "Tất cả" || c.city === filterCity;
    return matchSearch && matchCity;
  });

  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      setCinemas(cinemas.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter leading-none mb-2">
            Hệ thống <span className="text-amber-500">Chi Nhánh</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Quản lý {cinemas.length} cụm rạp trên toàn quốc
          </p>
        </div>

        <button className="flex items-center gap-2 bg-black text-amber-400 border-2 border-black px-6 py-3 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          <Plus size={18} strokeWidth={3} /> Thêm chi nhánh mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative md:col-span-2 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={20} />
          <input
            type="text"
            placeholder="TÌM TÊN RẠP, ĐỊA CHỈ..."
            className="w-full bg-white border-2 border-slate-200 p-4 pl-12 font-bold text-xs uppercase outline-none focus:border-black transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-white border-2 border-slate-200 p-4 font-bold text-xs uppercase outline-none focus:border-black cursor-pointer"
          onChange={(e) => setFilterCity(e.target.value)}
        >
          <option value="Tất cả">Tất cả khu vực</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Miền Tây">Miền Tây</option>
        </select>
      </div>

      {/* Cinemas Table */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-4 border-black text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-5 text-center">STT</th>
                <th className="p-5">Thông tin rạp</th>
                <th className="p-5">Khu vực</th>
                <th className="p-5 text-center">Số phòng</th>
                <th className="p-5">Trạng thái</th>
                <th className="p-5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              <AnimatePresence>
                {filteredCinemas.map((cinema, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={cinema.id} 
                    className="hover:bg-amber-50/50 transition-colors group"
                  >
                    <td className="p-5 text-center font-black text-slate-300 group-hover:text-black">
                      #{index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase italic tracking-tight flex items-center gap-2">
                          {cinema.name} 
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 cursor-pointer" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {cinema.address}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-block bg-white border-2 border-slate-200 px-3 py-1 rounded-lg font-black text-[9px] uppercase">
                        {cinema.city}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="font-black text-sm">{cinema.rooms}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cinema.status === "Bảo trì" ? "bg-red-500" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {cinema.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 border-2 border-transparent hover:border-black hover:bg-white transition-all text-slate-400 hover:text-blue-600 rounded-lg">
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cinema.id)}
                          className="p-2 border-2 border-transparent hover:border-black hover:bg-white transition-all text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-300">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCinemas.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-4">
              <Navigation size={32} className="text-slate-200" />
            </div>
            <h3 className="font-black text-xl uppercase italic text-slate-300">Không tìm thấy chi nhánh nào!</h3>
          </div>
        )}

        {/* Footer Table */}
        <div className="p-5 bg-slate-50 border-t-4 border-black flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 italic">
              Hiển thị {filteredCinemas.length} trên tổng số {cinemas.length} rạp
            </span>
            <div className="flex gap-2">
              <button className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xs hover:bg-amber-400 transition-colors">1</button>
              <button className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xs hover:bg-amber-400 transition-colors bg-white">2</button>
              <button className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xs hover:bg-amber-400 transition-colors bg-white"><ChevronRight size={14} strokeWidth={3}/></button>
            </div>
        </div>
      </div>
    </div>
  );
}