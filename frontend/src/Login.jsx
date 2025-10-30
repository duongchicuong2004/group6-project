import React, { useState } from "react";
import "./Login.css"; // 👉 thêm CSS (hoặc gộp vào App.css nếu muốn)

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          setToken(data.token);

          // 🧩 Lưu email & token để UploadAvatar dùng lại
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", email);

          // Gọi hàm cha (nếu có)
          if (typeof onLogin === "function") onLogin(data.token, data.user || null);
          setMessage("✅ Đăng nhập thành công!");
        } else {
          setMessage("⚠️ Đăng nhập thành công nhưng không nhận được token!");
        }
      } else {
        setMessage(`⚠️ ${data.message || "Sai thông tin đăng nhập"}`);
      }

    } catch (err) {
      setMessage("❌ Lỗi kết nối server");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p className="login-message">{message}</p>}

      {token && (
        <div className="token-box">
          <h4>JWT Token:</h4>
          <textarea value={token} readOnly rows="4" />
        </div>
      )}
    </div>
  );
}

export default Login;
