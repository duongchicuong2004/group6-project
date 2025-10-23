import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const [message, setMessage] = useState("");

  // GỌI API GET /profile để lấy thông tin người dùng
  useEffect(() => {
    axios
      .get("http://localhost:5000/user/profile/68f312b32b9de4655d5e7572")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Lỗi khi lấy profile:", err));
  }, []);

  // Hàm xử lý khi người dùng nhập dữ liệu
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // GỌI API PUT /profile để cập nhật thông tin
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/user/profile/68f312b32b9de4655d5e7572", user)
      .then((res) => setMessage("Cập nhật thành công!"))
      .catch((err) => setMessage("Lỗi khi cập nhật!"));
  };

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>

      <form className="profile-form" onSubmit={handleUpdate}>
        <div>
          <label>Họ tên:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Cập nhật</button>
      </form>

      {message && <p className="profile-message">{message}</p>}
    </div>
  );
};

export default Profile;
