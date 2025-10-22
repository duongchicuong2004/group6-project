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
  const [page, setPage] = useState("users"); // trang hiện tại

  // 🔹 Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/user");
      console.log("📡 Dữ liệu từ backend:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      console.log("🔍 Chi tiết:", err.response?.data || err.message);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Thêm người dùng
  const handleAddUser = async (name, email) => {
    try {
      await axios.post("http://localhost:5000/user", { name, email });
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm người dùng:", err);
    }
  };

  // 🔹 Xóa người dùng
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa người dùng:", err);
    }
  };

  // 🔹 Sửa người dùng
  const handleEdit = async (id, updatedUser) => {
    try {
      await axios.put(`http://localhost:5000/user/${id}`, updatedUser);
      await fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi sửa người dùng:", err);
    }
  };

  // 🔹 Tải danh sách khi mở trang
  useEffect(() => {
    fetchUsers();
  }, []);

  // ==============================
  // ✅ GIAO DIỆN
  // ==============================
  return (
    <div className="app-container">
      <div className="app-card">
        <h2>📋 Ứng dụng quản lý người dùng</h2>

        {/* 🔹 Thanh điều hướng */}
        <div className="nav-buttons">
          <button onClick={() => setPage("login")}>Đăng nhập</button>
          <button onClick={() => setPage("signup")}>Đăng ký</button>
          <button onClick={() => setPage("users")}>Quản lý người dùng</button>
          <button onClick={() => setPage("profile")}>Thông tin cá nhân</button>
        </div>

        {/* 🔹 Hiển thị trang tương ứng */}
        {page === "login" && <Login />}
        {page === "signup" && <SignUp />}

        {page === "users" && (
          <>
            {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
            {error && <p className="error">{error}</p>}

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

        {/* ✅ Trang hồ sơ cá nhân */}
        {page === "profile" && <Profile />}
      </div>
    </div>
  );
}

export default App;
