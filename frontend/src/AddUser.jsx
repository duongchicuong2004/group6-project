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
    <div>
      <h3>Thêm người dùng</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
