import React, { useState } from "react";
import axios from "axios";

function UserList({ users, setUsers, fetchUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  // Khi bấm nút "Sửa"
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email });
  };

  // Cập nhật user
  const handleUpdate = async (e) => {
    e?.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/user/${editingUser._id}`,
        formData
      );

      console.log("Kết quả PUT:", res);

      if (res.status === 200 || res.status === 201) {
        alert("✅ Cập nhật thành công!");
        setEditingUser(null);

        try {
          await fetchUsers(); // tải lại danh sách
        } catch (err) {
          console.error("Lỗi khi tải lại danh sách:", err);
          alert("⚠️ Cập nhật thành công nhưng lỗi khi tải lại danh sách!");
        }

      } else {
        alert("⚠️ Lỗi phản hồi từ server!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      alert("❌ Không thể cập nhật user!");
    }
  };


  // Xóa user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      alert("🗑️ Xóa thành công!");
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  return (
    <div>
      <h3>Danh sách người dùng</h3>

      {editingUser && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Sửa thông tin người dùng</h4>
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
          {/* ✅ Thêm type="button" để tránh submit form */}
          <button type="button" onClick={handleUpdate}>Cập nhật</button>
          <button type="button" onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
      )}

      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u._id}>
              <div className="user-info">
                {u.username} - {u.email}
              </div>
              <div className="actions">
                <button type="button" onClick={() => handleEdit(u)}>Sửa</button>
                <button type="button" onClick={() => handleDelete(u._id)}>Xóa</button>
              </div>
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
