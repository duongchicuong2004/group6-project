import React, { useState } from "react";
import axios from "axios";

const UploadAvatar = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Lấy URL API (backend chạy ở localhost:5000)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Lấy token nếu cần (nếu API không dùng JWT thì có thể bỏ)
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  // ✅ Khi chọn ảnh
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // ✅ Upload ảnh
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Vui lòng chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("email", "test@example.com"); // ⚠️ BẮT BUỘC vì backend của bạn cần email

      const res = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("✅ Server trả về:", res.data);
      setMessage("🎉 Cập nhật ảnh đại diện thành công!");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage(
        err.response?.data?.message ||
          `❌ Lỗi upload (${err.response?.status || "không rõ"})`
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
          📸 Upload Avatar
        </h2>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-green-500"
          />
        )}

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 w-full"
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded"
          >
            Cập nhật
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("🎉") ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadAvatar;
