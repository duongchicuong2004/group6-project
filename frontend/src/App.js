import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";
import UserList from "./UserList";
import SignUp from "./SignUp";
import Login from "./Login";
import Profile from "./Profile";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState("users"); // Trang mặc định là danh sách người dùng (Admin)

  // 🔹 Token state (keeps token and re-renders when login happens)
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // currentUser stores the logged-in user's info (from /auth/login response)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // 🔹 Config header (if token available)
  const axiosConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // computed helper: is current user an Admin? (case-insensitive)
  const isAdmin = !!(
    token &&
    currentUser &&
    currentUser.role &&
    currentUser.role.toString().toLowerCase() === "admin"
  );

  // ===============================
  // 📡 API: Lấy danh sách người dùng
  // ===============================
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
  const res = await axios.get("http://localhost:5000/user", axiosConfig);
      console.log("📡 Dữ liệu từ backend:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      console.log("🔍 Chi tiết:", err.response?.data || err.message);
      setError("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ➕ Thêm người dùng (nếu có quyền)
  // ===============================
  const handleAddUser = async (name, email) => {
    try {
  await axios.post("http://localhost:5000/user", { name, email }, axiosConfig);
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm người dùng:", err);
      alert("Không thể thêm người dùng!");
    }
  };

  // ===============================
  // 🗑️ Xóa người dùng
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/user/${id}`, axiosConfig);
      alert("🗑️ Xóa thành công!");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa người dùng:", err);
      alert("Không thể xóa người dùng (có thể do thiếu quyền)!");
    }
  };

  // ===============================
  // ✏️ Sửa thông tin người dùng
  // ===============================
  const handleEdit = async (id, updatedUser) => {
    try {
      await axios.put(`http://localhost:5000/user/${id}`, updatedUser, axiosConfig);
      alert("✅ Cập nhật thành công!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi sửa người dùng:", err);
      alert("Không thể sửa người dùng!");
    }
  };

  // 🔹 Tải danh sách khi mở trang **chỉ nếu** là Admin (or if token+user are already present)
  useEffect(() => {
    if (page === "users" && isAdmin) {
      fetchUsers();
    }
  }, [page, isAdmin]);

  // ===============================
  // ✅ Giao diện chính
  // ===============================
  return (
    <div className="app-container">
      <div className="app-card">
        <h2>📋 Trang Quản Lý Người Dùng (Admin)</h2>

        {/* 🔹 Thanh điều hướng */}
        <div className="nav-buttons">
          <button onClick={() => setPage("login")}>Đăng nhập</button>
          <button onClick={() => setPage("signup")}>Đăng ký</button>
          <button onClick={() => setPage("users")}>Quản lý người dùng</button>
          <button onClick={() => setPage("profile")}>Thông tin cá nhân</button>
          {token && (
            <button
              onClick={() => {
                // clear auth and return to login
                setToken("");
                setCurrentUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setPage("login");
              }}
              style={{ marginLeft: "8px", backgroundColor: "#d32f2f", color: "white" }}
            >
              Đăng xuất
            </button>
          )}
        </div>

        {/* 🔹 Hiển thị từng trang */}
        {page === "login" && (
          <Login
            onLogin={(tkn, user) => {
              // store token and user in App state and localStorage
              setToken(tkn);
              setCurrentUser(user || null);
              localStorage.setItem("token", tkn);
              if (user) localStorage.setItem("user", JSON.stringify(user));

              // route depending on role
              if (user && user.role === "Admin") {
                setPage("users");
                // fetchUsers will be triggered by the useEffect watching `isAdmin` and `page`
              } else {
                setPage("profile");
              }
            }}
          />
        )}
        {page === "signup" && <SignUp />}

        {page === "users" && (
          <>
            <p>Hiện đang đăng nhập: {currentUser ? `${currentUser.username || currentUser.email} (${currentUser.role})` : "Chưa đăng nhập"}</p>
            {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
            {error && <p className="error">{error}</p>}

            {!token && (
              <p className="warning">Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản Admin để xem danh sách.</p>
            )}

            {token && !isAdmin && (
              <p className="warning">Bạn không có quyền Admin — vui lòng đăng nhập bằng tài khoản Admin.</p>
            )}

            {isAdmin && (
              <>
                <div className="add-user-container">
                  <AddUser onAddUser={handleAddUser} />
                </div>

                <UserList
                  users={users}
                  setUsers={setUsers}
                  fetchUsers={fetchUsers}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </>
            )}
          </>
        )}

        {page === "profile" && <Profile />}
      </div>
    </div>
  );
}

export default App;
