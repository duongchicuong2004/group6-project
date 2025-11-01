import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy token từ URL (?token=...)
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Lấy URL backend từ biến môi trường (.env)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });
      setMessage("✅ Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Lỗi đặt lại mật khẩu.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
          🔒 Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            className="w-full p-2 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded"
          >
            Xác nhận
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
