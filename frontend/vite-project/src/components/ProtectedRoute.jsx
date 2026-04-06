import { Navigate, useLocation, Outlet } from "react-router-dom"; // 1. Thêm Outlet ở đây
import { useAuthStore } from "../store/useAuthStore";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // 1. ĐANG KIỂM TRA (Loading)
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fdfcf0]">
        <div className="text-4xl font-black italic tracking-tighter text-gray-900 animate-pulse">
          LUNA<span className="text-amber-500">CINEMA</span>
        </div>
      </div>
    );
  }

  // 2. CHƯA ĐĂNG NHẬP
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. KIỂM TRA QUYỀN ADMIN
  if (adminOnly && authUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. HỢP LỆ
  // Nếu dùng dạng <ProtectedRoute>...</ProtectedRoute> thì hiện children
  // Nếu dùng dạng <Route element={<ProtectedRoute />} > thì hiện Outlet
  return children ? children : <Outlet />; 
};