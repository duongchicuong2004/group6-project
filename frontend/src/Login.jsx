// 📁 src/Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "./store/authSlice";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const data = res.data;

      if (res.status === 200 && data.accessToken && data.user) {
        // ✅ Lưu vào Redux
        dispatch(loginSuccess({ token: data.accessToken, user: data.user }));

        // ✅ Lưu token vào localStorage nếu cần
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken || "");
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("✅ Đăng nhập thành công!");

        // ✅ Chuyển hướng theo vai trò
        const role = data.user.role?.toLowerCase();
        if (role === "admin" || role === "moderator") {
          navigate("/users");
        } else {
          navigate("/profile");
        }
      } else {
        setMessage("⚠️ Không nhận được token hợp lệ từ server!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Sai thông tin hoặc lỗi kết nối server.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default Login;
