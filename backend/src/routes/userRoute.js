import express from 'express';
import { authMe, updateProfile, getAllUsers } from '../controllers/userController.js'; 
import { protectRoute } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/me', protectRoute, authMe);
router.put('/update-profile', protectRoute, updateProfile);

// THÊM DÒNG NÀY: Đường dẫn lấy toàn bộ danh sách cho Admin
router.get('/all', protectRoute, getAllUsers); 

export default router;