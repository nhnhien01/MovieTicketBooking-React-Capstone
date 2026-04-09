import express from 'express';
import Booking from '../models/Booking.js';
// import { verifyToken } from '../middleware/auth.js'; // Giả sử bạn có middleware này

const router = express.Router();

// --- ROUTE 1: Đặt vé mới ---
router.post('/', async (req, res) => {
    try {
        const { 
            userId, 
            movieId, 
            seats, 
            totalAmount, 
            cinemaName, 
            showDate, 
            showTime 
        } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!userId || !movieId || !seats || seats.length === 0 || !totalAmount || !cinemaName || !showDate || !showTime) {
            return res.status(400).json({ 
                message: "Thông tin đặt vé không đầy đủ! Vui lòng kiểm tra lại rạp, ngày và giờ." 
            });
        }

        // 2. Tạo đối tượng booking mới
        const newBooking = new Booking({
            userId,
            movieId,
            seats,
            totalAmount,
            cinemaName,
            showDate,
            showTime,
            status: 'confirmed'
        });

        // 3. Lưu vào database
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: "Đặt vé thành công!", booking: savedBooking });

    } catch (error) {
        console.error("Lỗi Backend tại Route POST /:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi lưu vé!", error: error.message });
    }
}); // <--- ĐÃ THÊM DẤU ĐÓNG NGOẶC CÒN THIẾU Ở ĐÂY

// --- ROUTE 2: Lấy tất cả vé cho trang Admin ---
router.get('/admin/all', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'displayName phone email') // Thêm email nếu cần
            .populate('movieId', 'title posterUrl')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách vé", error: error.message });
    }
});

// --- ROUTE 3: Lấy lịch sử vé của User ---
// URL sẽ có dạng: /api/bookings/my-history?userId=123...
router.get('/my-history', async (req, res) => {
    try {
        // Lấy userId từ query string thay vì params
        const { userId } = req.query; 

        if (!userId) {
            return res.status(400).json({ message: "Thiếu ID người dùng!" });
        }

        const bookings = await Booking.find({ userId: userId })
            .populate('movieId', 'title posterUrl') 
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy lịch sử đặt vé", error: error.message });
    }
});

export default router;