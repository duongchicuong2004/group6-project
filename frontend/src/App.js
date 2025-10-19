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

  // 🔹 Hàm thêm người dùng
  const handleAddUser = async (name, email) => {
    try {
      await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      fetchUsers(); // <-- gọi lại để cập nhật danh sách
    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
    }
  };

  // 🔹 Gọi fetch lần đầu khi render
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Quản lý người dùng (Kết nối MongoDB Atlas)</h2>
      <AddUser onAddUser={handleAddUser} />
      <UserList users={users} />
    </div>
  );
}

export default App;
