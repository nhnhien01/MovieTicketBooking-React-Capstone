import User from "../models/User.js";

// Lấy thông tin cá nhân
export const authMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName, 
                phone: user.phone || "",
                profilePic: user.avatarUrl || "", 
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// CẬP NHẬT THÔNG TIN (Hàm này giúp bạn bấm Lưu thành công)
export const updateProfile = async (req, res) => {
    try {
        const { displayName, phone } = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { displayName, phone },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công!",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lưu dữ liệu" });
    }
};