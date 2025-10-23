import React, { useState } from "react";

function AddUser({ onAddUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🧩 Validation được thêm vào (không sửa logic cũ)
    if (!name.trim()) {
      alert("Tên không được để trống!");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    if (!name || !email) return alert("Vui lòng nhập đủ thông tin!");
    onAddUser(name, email);
    setName("");
    setEmail("");
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: "0 0 8px 0" }}>Thêm người dùng</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...inputStyle, marginLeft: "8px" }}
        />
        <button type="submit" style={addBtnStyle}>
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddUser;

const containerStyle = { marginBottom: "12px" };

const formStyle = { display: "flex", alignItems: "center", gap: "8px" };

const inputStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #cfd",
  minWidth: "160px",
};

const addBtnStyle = {
  backgroundColor: "#00796b",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};
