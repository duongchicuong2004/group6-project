import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    avatarUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Lấy token từ localStorage
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  // ✅ Lấy URL backend từ biến môi trường (nếu có)
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Lấy thông tin người dùng khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setMessage("⚠️ Vui lòng đăng nhập để xem thông tin cá nhân.");
          return;
        }

        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = res.data || {};
        setUser({
          name: profile.full_name || profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          avatarUrl: profile.avatarUrl || "",
          password: "",
        });
      } catch (err) {
        console.error("❌ Lỗi tải thông tin:", err);
        setMessage("❌ Không thể tải thông tin cá nhân!");
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Cập nhật thông tin người dùng
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        setMessage("⚠️ Vui lòng đăng nhập để cập nhật thông tin.");
        return;
      }

      const updateData = {
        full_name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };

      if (user.password.trim() !== "") updateData.password = user.password;

      await axios.put(`${API_URL}/user/profile`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Cập nhật thông tin thành công!");
      setUser({ ...user, password: "" });
    } catch (err) {
      const detail = err.response?.data?.message || err.message;
      setMessage(`❌ Lỗi khi cập nhật: ${detail}`);
    }
  };

  // ✅ Upload Avatar
  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setMessage("⚠️ Hãy chọn ảnh trước khi upload!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("email", user.email);

    try {
      const res = await axios.post(`${API_URL}/auth/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser({ ...user, avatarUrl: res.data.avatarUrl });
      setPreview(null);
      setSelectedFile(null);
      setMessage("✅ Upload avatar thành công!");
    } catch (err) {
      console.error("❌ Upload lỗi:", err);
      setMessage("❌ Upload thất bại!");
    }
  };

  // ✅ Hiển thị ảnh xem trước khi chọn
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔒 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={pageStyle}>
      <div style={card}>
        <h2 style={cardTitle}>Thông tin cá nhân</h2>

        {/* --- Avatar --- */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={preview || user.avatarUrl || "https://via.placeholder.com/120"}
            alt="Avatar"
            style={avatarStyle}
          />
          <div style={{ marginTop: "10px" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUploadAvatar} style={uploadBtn}>
              Upload Avatar
            </button>
          </div>
        </div>

        {/* --- Form cập nhật --- */}
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
            Mật khẩu mới (nếu muốn đổi)
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
            <button type="button" onClick={handleLogout} style={logoutBtn}>
              Đăng xuất
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{
              marginTop: "14px",
              color: message.startsWith("✅") ? "green" : "#d32f2f",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// =================== STYLE ===================
const pageStyle = {
  backgroundColor: "#e8f5ee",
  minHeight: "100vh",
  padding: "40px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const card = {
  width: "min(680px, 92%)",
  background: "#fff",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const cardTitle = { color: "#00695c", marginBottom: "18px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontSize: "14px",
  color: "#333",
};
const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccd",
  marginTop: "6px",
  fontSize: "14px",
};

const avatarStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #00796b",
};

const uploadBtn = {
  marginLeft: "10px",
  backgroundColor: "#009688",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const actionsRow = { display: "flex", gap: "12px", marginTop: "10px" };
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
