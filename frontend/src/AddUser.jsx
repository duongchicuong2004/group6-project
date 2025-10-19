import React, { useState } from "react";
import axios from "axios";

function AddUser() {
  const [user, setUser] = useState({ name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users", user);
      alert("Thêm user thành công!");
      setUser({ name: "", email: "" });
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm user!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm người dùng</h2>
      <input
        type="text"
        placeholder="Tên"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
