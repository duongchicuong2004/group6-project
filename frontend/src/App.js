import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import UserList from "./UserList";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  // ✅ State nâng cao
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
  <div className="app-container">
    <div className="app-card">
      <h2>📋 Quản lý người dùng (Kết nối MongoDB Atlas)</h2>

      {/* ✅ Hiển thị trạng thái */}
      {loading && <p className="loading">⏳ Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}

      <AddUser onAddUser={handleAddUser} />
      <UserList
        users={users}
        setUsers={setUsers}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  </div>
);
}

export default App;
