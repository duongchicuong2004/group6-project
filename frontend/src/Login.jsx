// 📁 src/Login.jsx
import React, { useState } from "react";
import api from "./api"; // ✅ import axios instance có refresh tự động
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi API login
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      if (res.status === 200) {
        if (data.accessToken && data.refreshToken) {
          // ✅ Lưu token vào localStorage
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("email", email);

          setToken(data.accessToken);
          setMessage("✅ Đăng nhập thành công!");

          // Callback cho App (nếu có)
          if (typeof onLogin === "function")
            onLogin(data.accessToken, data.user || null);
        } else {
          setMessage("⚠️ Không nhận được token hợp lệ từ server!");
        }
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

      {token && (
        <div className="token-box">
          <h4>Access Token:</h4>
          <textarea value={token} readOnly rows="5" />
        </div>
      )}
    </div>
  );
}

export default Login;
