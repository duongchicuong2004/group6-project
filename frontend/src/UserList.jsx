import React, { useState, useEffect } from "react";
import axios from "axios";

function UserList({ users = [], setUsers, fetchUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "User",
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/user/${editingUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Cập nhật thành công!");
      setEditingUser(null);
      if (typeof fetchUsers === "function") await fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      alert("Không thể cập nhật người dùng!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Xóa thành công!");
      if (typeof fetchUsers === "function") await fetchUsers();
      else setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi xóa user:", error);
      alert("Không thể xóa người dùng!");
    }
  };

  useEffect(() => {
    console.log("UserList received users:", users);
  }, [users]);

  return (
    <div>
      <h3>👑 Danh sách người dùng (Admin)</h3>

      {editingUser && (
        <div className="edit-section">
          <h4>✏️ Sửa thông tin người dùng</h4>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Tên đăng nhập"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
          />

          {/* ✅ Chỉnh style cho combo box giống ô input */}
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            style={{
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              height: "36px",
              marginRight: "8px",
            }}
          >
            <option value="User">User</option>
            <option value="Moderator">Moderator</option>
          </select>

          <button type="button" onClick={handleUpdate}>
            Cập nhật
          </button>
          <button type="button" onClick={() => setEditingUser(null)}>
            Hủy
          </button>
        </div>
      )}

      <ul className="user-list">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((u) => (
            <li key={u._id} className="user-item">
              <div>
                {u.username} - {u.email} ({u.role})
              </div>
              <div>
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u._id)}>Xóa</button>
              </div>
            </li>
          ))
        ) : (
          <li>Không có người dùng nào.</li>
        )}
      </ul>
    </div>
  );
}

export default UserList;
