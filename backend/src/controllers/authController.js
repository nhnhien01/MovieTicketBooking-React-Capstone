import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// --- ĐĂNG NHẬP ---
export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: "Sai tài khoản!" });

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: "Sai mật khẩu!" });

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_ACCESS_KEY || "LUNA_SECRET",
            { expiresIn: "7d" }
        );

        const { hashedPassword: _, ...userData } = user._doc;
        res.status(200).json({ success: true, user: userData, accessToken: token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- ĐĂNG KÝ ---
export const signUp = async (req, res) => {
    try {
        const { username, password, email, displayName } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ success: false, message: "Trùng tài khoản!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, hashedPassword, email, displayName, role: "user" });
        await newUser.save();
        res.status(201).json({ success: true, message: "Đăng ký xong!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- ĐĂNG XUẤT ---
export const signOut = async (req, res) => {
    res.status(200).json({ success: true, message: "Đã đăng xuất!" });
};

// --- CẬP NHẬT HỒ SƠ (Dòng này giúp nút "Lưu hồ sơ" chạy) ---
export const updateProfile = async (req, res) => {
  try {
    const { displayName, phone } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { displayName, phone } }, // Dùng $set cho chắc chắn
      { new: true, runValidators: true }
    ).select("-hashedPassword");

    if (!updatedUser) return res.status(404).json({ success: false, message: "Không tìm thấy user" });

    res.status(200).json({ success: true, user: updatedUser, message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi: " + error.message });
  }
};

// --- ĐỔI MẬT KHẨU (Dòng này giúp nút "Cập nhật bảo mật" chạy) ---
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Mật khẩu cũ không đúng!" });

    const salt = await bcrypt.getSalt(10);
    user.hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};