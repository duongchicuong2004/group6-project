// 📁 src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

import AddUser from "./AddUser";
import UserList from "./UserList";
import SignUp from "./SignUp";
import Login from "./Login";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UploadAvatar from "./UploadAvatar";
import LogsPage from "./LogsPage";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🧠 Lấy token & user từ Redux store
  const { token, user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isModerator = user?.role?.toLowerCase() === "moderator";
  const isAdminOrModerator = isAdmin || isModerator;

  // 🌍 Backend URL tự động (Render)
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Gắn token nếu có
  const axiosConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // ✅ Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/user`, axiosConfig);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách người dùng:", err);
      setError("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrModerator) fetchUsers();
  }, [isAdminOrModerator]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <h2>📋 Trang Quản Lý Người Dùng</h2>

        {/* 🔹 Menu điều hướng */}
        <div className="nav-buttons">
          {!token ? (
            <>
              <Link to="/login"><button>Đăng nhập</button></Link>
              <Link to="/signup"><button>Đăng ký</button></Link>
              <Link to="/forgot-password"><button>Quên mật khẩu</button></Link>
            </>
          ) : (
            <>
              <Link to="/users"><button>Quản lý người dùng</button></Link>
              <Link to="/profile"><button>Thông tin cá nhân</button></Link>
              <Link to="/upload-avatar"><button>Upload Avatar</button></Link>

              {isAdmin && (
                <Link to="/admin/logs">
                  <button style={{ backgroundColor: "#00695c", color: "white" }}>
                    📘 Xem Log Hoạt Động
                  </button>
                </Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#d32f2f",
                  color: "white",
                }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>

        {/* 🔹 Routes */}
        <Routes>
          {/* Đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Các route công khai */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Trang profile (chỉ khi đăng nhập) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Trang upload avatar */}
          <Route
            path="/upload-avatar"
            element={
              <ProtectedRoute>
                <UploadAvatar token={token} />
              </ProtectedRoute>
            }
          />

          {/* Trang user list (chỉ admin / moderator) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                <>
                  {isAdmin && (
                    <AddUser
                      onAddUser={async (name, email) => {
                        await axios.post(
                          `${API_URL}/user`,
                          { name, email },
                          axiosConfig
                        );
                        await fetchUsers();
                      }}
                    />
                  )}
                  <UserList
                    users={users}
                    setUsers={setUsers}
                    fetchUsers={fetchUsers}
                    handleEdit={
                      isAdmin
                        ? async (id, data) => {
                            await axios.put(
                              `${API_URL}/user/${id}`,
                              data,
                              axiosConfig
                            );
                            await fetchUsers();
                          }
                        : null
                    }
                    handleDelete={
                      isAdmin
                        ? async (id) => {
                            await axios.delete(
                              `${API_URL}/user/${id}`,
                              axiosConfig
                            );
                            setUsers(users.filter((u) => u._id !== id));
                          }
                        : null
                    }
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* Trang logs (chỉ admin) */}
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LogsPage />
              </ProtectedRoute>
            }
          />

          {/* Trang mặc định */}
          <Route
            path="/"
            element={
              token ? (
                isAdminOrModerator ? (
                  <ProtectedRoute>
                    <UserList
                      users={users}
                      setUsers={setUsers}
                      fetchUsers={fetchUsers}
                      handleEdit={null}
                      handleDelete={null}
                    />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )
              ) : (
                <Login />
              )
            }
          />

          {/* Trang không tồn tại */}
          <Route path="*" element={<h3>404 - Trang không tồn tại</h3>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
