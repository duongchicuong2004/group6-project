import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  // get current user id from localStorage (stored by App after login)
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch {}
  const userId = storedUser ? storedUser._id || storedUser.id : null;

  // ✅ Lấy thông tin khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          setMessage("⚠️ Không có userId. Hãy đăng nhập lại.");
          return;
        }

        const res = await axios.get(`http://localhost:5000/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Không thể tải thông tin cá nhân!");
      }
    };
    fetchProfile();
  }, [token]);

  // ✅ Cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        setMessage("⚠️ Không có userId. Hãy đăng nhập lại.");
        return;
      }

      // prepare payload without password if empty
      const updateData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };
      if (user.password && user.password.trim() !== "") {
        updateData.password = user.password;
      }

      const res = await axios.put(
        `http://localhost:5000/user/profile/${userId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Cập nhật thành công!");
      // clear password field after success
      setUser((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      // try to surface server message if available
      const detail = err.response?.data?.message || err.message;
      setMessage(`❌ Lỗi khi cập nhật: ${detail}`);
    }
  };

  // 🔒 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ backgroundColor: "#e8f5ee", minHeight: "100vh", padding: "40px 0" }}>
      <div style={cardWrapper}>
        <div style={card}>
          <h2 style={cardTitle}>Thông tin cá nhân</h2>

          <form onSubmit={handleUpdate} style={formStyle}>
            <label style={labelStyle}>
              Họ tên
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                style={inputStyle}
                placeholder="Họ và tên"
              />
            </label>

            <label style={labelStyle}>
              Email
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                style={inputStyle}
                placeholder="example@mail.com"
              />
            </label>

            <label style={labelStyle}>
              Số điện thoại
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                style={inputStyle}
                placeholder="0123 456 789"
              />
            </label>

            <label style={labelStyle}>
              Địa chỉ
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                style={inputStyle}
                placeholder="Địa chỉ"
              />
            </label>

            <label style={labelStyle}>
              Mật khẩu mới (nếu đổi)
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                style={inputStyle}
                placeholder="********"
              />
            </label>

            <div style={actionsRow}>
              <button type="submit" style={saveBtn}>
                Cập nhật
              </button>
            </div>
          </form>

          {message && (
            <p style={{ marginTop: "12px", color: message.startsWith("✅") ? "green" : "#d32f2f" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// (old small styles removed; new styles are defined below)

// --- Inline styles for Profile component ---
const cardWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const card = {
  width: "min(680px, 92%)",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const cardTitle = { color: "#00695c", margin: "0 0 14px 0" };

const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };

const labelStyle = { display: "flex", flexDirection: "column", fontSize: "14px", color: "#333" };

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccd",
  marginTop: "6px",
  fontSize: "14px",
};

const actionsRow = { display: "flex", gap: "12px", marginTop: "8px" };

const saveBtn = {
  backgroundColor: "#00796b",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const logoutBtn = {
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Profile;
