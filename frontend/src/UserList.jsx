import React, { useState, useEffect } from "react";
import axios from "axios";

function UserList({ users = [], setUsers, fetchUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  // ✅ Khi bấm "Sửa"
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username || "", email: user.email || "" });
  };

  // ✅ Cập nhật user (PUT)
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/user/${editingUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Cập nhật thành công!");
      setEditingUser(null);
      if (typeof fetchUsers === "function") await fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      alert("Không thể cập nhật user!");
    }
  };

  // ✅ Xóa user (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Xóa thành công!");
      // reload from server to ensure UI matches backend
      if (typeof fetchUsers === "function") await fetchUsers();
      else setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi xóa user:", error);
      alert("Không thể xóa người dùng!");
    }
  };

  // debug: log incoming users prop
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
