import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";
import UserList from "./UserList";

function App() {
  const [users, setUsers] = useState([]);

  // 🔹 Lấy danh sách người dùng từ backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/user");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
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
    <div>
      <h2>Quản lý người dùng (Kết nối MongoDB Atlas)</h2>
      <AddUser onAddUser={handleAddUser} />
      {/* ✅ Truyền thêm setUsers, handleEdit, handleDelete */}
      <UserList
        users={users}
        setUsers={setUsers}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
