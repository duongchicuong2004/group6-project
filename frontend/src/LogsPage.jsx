import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // ✅ Lấy URL backend từ biến môi trường (nếu có)
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        // ✅ Token lưu đúng key (đồng bộ với Login.jsx)
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token");

        if (!token) {
          setError("Bạn cần đăng nhập với quyền admin để xem log!");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLogs(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải log:", err);
        setError("Không thể tải danh sách log từ server!");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <h3 style={{ textAlign: "center" }}>⏳ Đang tải...</h3>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f8fff8",
        borderRadius: "12px",
        maxWidth: "900px",
        margin: "40px auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#006400" }}>
        📘 Nhật ký hoạt động người dùng
      </h2>

      {logs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          Không có log nào để hiển thị.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#dfffd8" }}>
              <th style={thStyle}>Người dùng</th>
              <th style={thStyle}>Hành động</th>
              <th style={thStyle}>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 ? "#fff" : "#f6fff6" }}>
                <td style={tdStyle}>{log.userId?.email || "Khách"}</td>
                <td style={tdStyle}>{log.action}</td>
                <td style={tdStyle}>
                  {new Date(log.timestamp).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
