import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

import Navbar1 from "./components/Navbar1";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home1 from "./pages/Home1";
import MoviesPage from "./pages/MoviesPage"; 
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import UserProfile from "./pages/Client/UserProfile";
import AdminDashboard from "./pages/Admin/Dashboard12";
import AddMovie from "./pages/Admin/AddMovie";
import MovieUpdate from "./pages/Admin/MovieUpdate";
// Kiểm tra kỹ đường dẫn này: Admin hay admin?
import UserManagement from "./pages/Admin/UserManagement"; 

export default function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname.startsWith("/admin");
  const showNavbar = !isLoginPage && !isAdminPage;

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fdfcf0]">
        <div className="text-4xl font-black italic tracking-tighter text-gray-900 animate-bounce">
          LUNA<span className="text-amber-500">CINEMA</span>
        </div>
        <Loader2 className="mt-4 animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {showNavbar && <Navbar1 />}

      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/movies" element={<MoviesPage />} />

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" replace />}
        />

        <Route path="/movie/:id" element={<MovieDetail />} />

        <Route
          path="/profile"
          element={authUser ? <UserProfile /> : <Navigate to="/login" replace />}
        />

        {/* Cụm Admin - Đã sửa lỗi path */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="movies" element={<AdminDashboard />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="edit-movie/:id" element={<MovieUpdate />} />
          <Route path="update-movie/:id" element={<MovieUpdate />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}