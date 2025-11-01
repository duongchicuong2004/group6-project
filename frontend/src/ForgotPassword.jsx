import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Nếu không có REACT_APP_API_URL thì dùng URL deploy mặc định
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      setMessage(res.data.message || "✅ Đã gửi email đặt lại mật khẩu!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage(err.response?.data?.message || "❌ Lỗi gửi yêu cầu đặt lại mật khẩu.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
          🔑 Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email đăng ký"
            className="w-full p-2 border rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded"
          >
            Gửi
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
