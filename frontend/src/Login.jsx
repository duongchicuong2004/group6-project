import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Sửa lại URL cho đúng với backend của bạn
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Nếu backend trả token
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p>{message}</p>}

      {token && (
        <div>
          <h4>JWT Token:</h4>
          <textarea value={token} readOnly rows="4" cols="60" />
        </div>
      )}
    </div>
  );
}

export default Login;
