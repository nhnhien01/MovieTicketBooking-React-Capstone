import express from "express";
const router = express.Router();
import { signIn, signUp, signOut, updateProfile, changePassword } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// 2 Dòng quan trọng nhất để hồ sơ hoạt động:
router.put("/update-profile", protectRoute, updateProfile);
router.put("/change-password", protectRoute, changePassword);

export default router;