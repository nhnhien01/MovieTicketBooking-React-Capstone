import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from './models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const movies = [
  {
    title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE",
    description: "Sau khi gặp lại Gwen Stacy, chàng hàng xóm thân thiện Spider-Man của Brooklyn bị cuốn vào đa vũ trụ...",
    posterUrl: "https://www.movieposters.com/cdn/shop/files/spiderman_across_the_spiderverse_ver36_xlg_grande.jpg?v=1762973413",
    bannerUrl: "https://weliveentertainment.com/wp-content/uploads/2023/05/across-spider-verse-banner-4.jpg",
    genre: ["Animation", "Action", "Adventure"],
    rating: 8.9,
    duration: 140,
    trailerUrl: "https://www.youtube.com/embed/shW9i6k8cB0",
    status: "showing",
    releaseDate: "2023-06-02"
  },
  {
    title: "AVATAR: THE WAY OF WATER",
    description: "Hơn một thập kỷ sau những sự kiện của phần phim đầu tiên, Jake Sully và Neytiri giờ đây đã lập gia đình...",
    posterUrl: "https://www.movieposters.com/cdn/shop/products/avatar-the-way-of-water_sncuhzap_1024x1024.jpg?v=1762971780",
    bannerUrl: "https://blairburke.com/images/hero-avatar.jpg",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.5,
    duration: 192,
    trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
    status: "showing",
    releaseDate: "2022-12-16"
  },
  {
    title: "OPPENHEIMER",
    description: "Bộ phim tiểu sử kịch tính đưa khán giả vào tâm trí của J. Robert Oppenheimer...",
    posterUrl: "https://cdna.artstation.com/p/assets/images/images/063/096/684/large/william-j-harris-oppenheimer-movie-poster-2023.jpg?1684720979",
    bannerUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsEj17H_TcFdoT_VfWIEj27Z03Jf4XLar0FA&s",
    genre: ["Drama", "History", "Biography"],
    rating: 9.0,
    duration: 180,
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    status: "showing",
    releaseDate: "2023-07-21"
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_CONNECTONSTRING;
    if (!uri) {
      console.error("Lỗi: Không tìm thấy MONGODB_CONNECTONSTRING");
      process.exit(1);
    }

    console.log("Đang kết nối database...");
    await mongoose.connect(uri);
    
    console.log(" Đang kiểm tra và cập nhật dữ liệu...");

    // SỬA LỖI TẠI ĐÂY: movieData viết liền
    for (const movieData of movies) {
      await Movie.updateOne(
        { title: movieData.title }, // Tìm theo tiêu đề
        { $setOnInsert: movieData }, // Nếu không thấy thì mới chèn
        { upsert: true }             // Cơ chế: Thêm nếu chưa có, có rồi bỏ qua
      );
    }
    
    console.log("Hoàn tất! Phim mới đã được cập nhật.");
    
    // Ngắt kết nối xong mới exit
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(" Lỗi:", err.message);
    process.exit(1);
  }
};

seedDB();