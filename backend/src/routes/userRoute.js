import express from 'express';
import { authMe, updateProfile } from '../controllers/userController.js'; 
import { protectRoute } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// Lấy thông tin cá nhân (Cần đăng nhập là xem được)
router.get('/me', protectRoute, authMe);

// Cập nhật hồ sơ (Cần đăng nhập là sửa được)
router.put('/update-profile', protectRoute, updateProfile);

export default router;