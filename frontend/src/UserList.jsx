import React, { useState } from "react";
import axios from "axios";

function UserList({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // 👉 Khi bấm nút Sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  // 👉 Gửi PUT request để cập nhật user
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/user/${editingUser._id}`, formData);
      setUsers(
        users.map((u) =>
          u._id === editingUser._id ? { ...u, ...formData } : u
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
    }
  };

  // 👉 Xóa user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  return (
    <div>
      <h3>Danh sách người dùng</h3>

      {editingUser && (
        <div>
          <h4>Sửa thông tin người dùng</h4>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tên"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
          />
          <button onClick={handleUpdate}>Cập nhật</button>
          <button onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
      )}

      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u._id}>
              {u.name} - {u.email}{" "}
              <button onClick={() => handleEdit(u)}>Sửa</button>
              <button onClick={() => handleDelete(u._id)}>Xóa</button>
            </li>
          ))
        ) : (
          <li>Chưa có người dùng nào</li>
        )}
      </ul>
    </div>
  );
}

export default UserList;
