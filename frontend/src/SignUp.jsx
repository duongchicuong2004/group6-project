import React, { useState } from "react";
import "./SignUp.css"; // 👉 thêm dòng này để tách style riêng (hoặc dán vào App.css)

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Đăng ký thành công!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`⚠️ ${data.message || "Đăng ký thất bại"}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối server");
    }
  };

  return (
    <div className="signup-container">
      <h2>Đăng ký</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p className="signup-message">{message}</p>}
    </div>
  );
}

export default SignUp;
