import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import movieRoute from './routes/movieRoutes.js'; 
import bookingRoute from './routes/bookingRoutes.js'; 
import { protectRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARES ---

// Sửa lại CORS để chấp nhận cả localhost và link Frontend sau khi deploy
app.use(cors({
  origin: [
    "http://localhost:5173",          // Cho lúc bạn code dưới máy (Local)
    process.env.FRONTEND_URL          // Cho lúc deploy (Link Vercel/Netlify)
  ].filter(Boolean),                  // Loại bỏ giá trị undefined nếu chưa có FRONTEND_URL
  credentials: true                
}));

app.use(express.json());
app.use(cookieParser()); 

// --- ROUTES ---

// 1. PUBLIC ROUTES
app.use('/api/auth', authRoute);
app.use('/api/movies', movieRoute); 

// 2. PRIVATE ROUTES
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute); 

// --- KẾT NỐI VÀ KHỞI CHẠY ---
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối Database:", err.message);
    process.exit(1); 
  });