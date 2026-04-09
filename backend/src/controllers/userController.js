import User from "../models/User.js";

// 1. Lấy thông tin cá nhân (Của chính mình)
export const authMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy!" });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// 2. LẤY TẤT CẢ NGƯỜI DÙNG (Dành cho trang Quản lý) - THÊM MỚI HÀM NÀY
export const getAllUsers = async (req, res) => {
    try {
        // Chỉ cho phép Admin lấy toàn bộ danh sách
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Bạn không có quyền Admin!" });
        }

        const users = await User.find().select("-hashedPassword").sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách" });
    }
};

// 3. Cập nhật hồ sơ
export const updateProfile = async (req, res) => {
    try {
        const { displayName, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { displayName, phone },
            { new: true }
        );
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật" });
    }
};