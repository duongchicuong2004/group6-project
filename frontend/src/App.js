import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AddUser from "./AddUser";
import UserList from "./UserList";
import SignUp from "./SignUp";
import Login from "./Login";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UploadAvatar from "./UploadAvatar";
import LogsPage from "./LogsPage"; // ✅ Trang log
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // ✅ Phân quyền
  const isAdmin = token && currentUser?.role?.toLowerCase() === "admin";
  const isModerator = token && currentUser?.role?.toLowerCase() === "moderator";
  const isAdminOrModerator = isAdmin || isModerator;

  const axiosConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // ======== API: Lấy danh sách người dùng ========
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/user", axiosConfig);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      setError("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Moderator cũng được xem danh sách
  useEffect(() => {
    if (isAdminOrModerator) fetchUsers();
  }, [isAdminOrModerator]);

  const handleLogout = () => {
    setToken("");
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ======== Giao diện ========
  return (
    <div className="app-container">
      <div className="app-card">
        <h2>📋 Trang Quản Lý Người Dùng</h2>

        {/* 🔹 Menu điều hướng */}
        <div className="nav-buttons">
          <Link to="/login"><button>Đăng nhập</button></Link>
          <Link to="/signup"><button>Đăng ký</button></Link>
          <Link to="/forgot-password"><button>Quên mật khẩu</button></Link>
          <Link to="/users"><button>Quản lý người dùng</button></Link>
          <Link to="/profile"><button>Thông tin cá nhân</button></Link>
          <Link to="/upload-avatar"><button>Upload Avatar</button></Link>

          {/* 🔸 Chỉ Admin mới thấy nút này */}
          {isAdmin && (
            <Link to="/admin/logs">
              <button style={{ backgroundColor: "#00695c", color: "white" }}>
                📘 Xem Log Hoạt Động
</button>
            </Link>
          )}

          {token && (
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
          )}
        </div>

        {/* 🔹 Các Route hiển thị theo URL */}
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLogin={(tkn, user) => {
                  setToken(tkn);
                  setCurrentUser(user || null);
                  localStorage.setItem("token", tkn);
                  if (user) localStorage.setItem("user", JSON.stringify(user));
                  navigate(user?.role === "Admin" ? "/users" : "/profile");
                }}
              />
            }
          />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/upload-avatar" element={<UploadAvatar token={token} />} />

          {/* 🔸 Trang log dành riêng cho Admin */}
          <Route
            path="/admin/logs"
            element={
              isAdmin ? (
                <LogsPage />
              ) : (
                <p className="warning">🚫 Bạn không có quyền xem trang này.</p>
              )
            }
          />

          {/* 🔸 Trang quản lý người dùng */}
          <Route
            path="/users"
            element={
              isAdminOrModerator ? (
                <>
                  {/* 🧑 Moderator chỉ xem, Admin mới thêm/sửa/xóa */}
                  {isAdmin && (
                    <AddUser
                      onAddUser={async (name, email) => {
                        await axios.post(
                          "http://localhost:5000/user",
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
                              `http://localhost:5000/user/${id}`,
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
`http://localhost:5000/user/${id}`,
                              axiosConfig
                            );
                            setUsers(users.filter((u) => u._id !== id));
                          }
                        : null
                    }
                  />
                </>
              ) : (
                <p className="warning">🚫 Bạn không có quyền truy cập trang này.</p>
              )
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
