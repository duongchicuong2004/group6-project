import React, { useState } from "react";
import axios from "axios";

const UploadAvatar = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Vui lòng chọn ảnh!");

    const formData = new FormData();
    formData.append("avatar", file);

    // 🧩 gửi email từ localStorage
    const email = localStorage.getItem("email");
    formData.append("email", email);

    try {
        const res = await axios.post("http://localhost:5000/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("🎉 Cập nhật ảnh đại diện thành công!");
    } catch (err) {
        setMessage(err.response?.data?.message || "Lỗi khi tải ảnh lên.");
    }
};




  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
          📸 Upload Avatar
        </h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded"
          >
            Cập nhật
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UploadAvatar;
