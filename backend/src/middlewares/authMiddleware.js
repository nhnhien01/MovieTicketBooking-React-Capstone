import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Kiểm tra Đăng nhập (Gắn user vào req)
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Bạn cần đăng nhập!" });

    const secret = process.env.JWT_ACCESS_KEY || "LUNA_SECRET";
    const decoded = jwt.verify(token, secret);

    // Tìm user và không lấy password
    const user = await User.findById(decoded._id || decoded.id || decoded.userId).select("-hashedPassword");
    if (!user) return res.status(401).json({ message: "User không tồn tại!" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

// 2. Kiểm tra quyền Admin (Cách viết chuẩn để dùng trong Route)
export const verifyAdmin = (req, res, next) => {
  // Vì chúng ta sẽ dùng protectRoute trước verifyAdmin trong file Route 
  // nên req.user chắc chắn đã tồn tại nếu pass qua protectRoute
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: "Bạn không có quyền Admin!" 
    });
  }
};

// Tạo Alias nếu file server.js của bạn gọi tên này
export const protectedRoute = protectRoute;