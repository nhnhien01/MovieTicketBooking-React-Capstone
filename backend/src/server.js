import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import movieRoute from './routes/movieRoutes.js'; 
import bookingRoute from './routes/bookingRoutes.js'; 
import { protectRoute } from './middlewares/authMiddleware.js'; // đổi lại cho khớp

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARES ---
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));

app.use(express.json());
app.use(cookieParser()); 

// --- ROUTES ---

// 1. PUBLIC ROUTES (Không cần đăng nhập)
app.use('/api/auth', authRoute);
app.use('/api/movies', movieRoute); 

// 2. PRIVATE ROUTES (Phải có Token - Đã đăng nhập)
app.use(protectRoute); 
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute); 

// --- KẾT NỐI VÀ KHỞI CHẠY ---
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server đang chạy tại: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối Database:", err.message);
    process.exit(1); 
  });