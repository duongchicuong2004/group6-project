import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import UserList from "./UserList";
import SignUp from "./SignUp";
import Login from "./Login";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Điều hướng giữa các trang
  const [page, setPage] = useState("users");

  // 🔹 Lấy danh sách người dùng từ backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/user");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Thêm người dùng
  const handleAddUser = async (name, email) => {
    try {
      await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
    }
  };

  // 🔹 XÓA user
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/user/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
    }
  };

  // 🔹 SỬA user
  const handleEdit = async (id, updatedUser) => {
    try {
      await fetch(`http://localhost:5000/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi sửa người dùng:", err);
    }
  };

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
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setPage("login")}>Đăng nhập</button>
          <button onClick={() => setPage("signup")}>Đăng ký</button>
          <button onClick={() => setPage("users")}>Quản lý người dùng</button>
        </div>

        {/* 🔹 Hiển thị trang tương ứng */}
        {page === "login" && <Login />}
        {page === "signup" && <SignUp />}
        {page === "users" && (
          <>
            {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
            {error && <p className="error">{error}</p>}
            <AddUser onAddUser={handleAddUser} />
            <UserList
              users={users}
              setUsers={setUsers}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
