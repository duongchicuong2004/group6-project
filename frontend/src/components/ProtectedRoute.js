// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);
  const userRole = user?.role?.toLowerCase();

  // ⛔ Nếu chưa đăng nhập → chuyển về /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Nếu có danh sách vai trò được phép
  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        🚫 Bạn không có quyền truy cập trang này.
      </p>
    );
  }

  // ✅ Nếu hợp lệ → render component con
  return children;
};

export default ProtectedRoute;
