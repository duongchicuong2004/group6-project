// ==============================
// 📦 IMPORT CÁC MODULE CẦN THIẾT
// ==============================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

// ==============================
// ⚙️ ĐỌC FILE .env (trong thư mục backend)
// ==============================
dotenv.config();
// ==============================
// 🔑 KIỂM TRA JWT SECRET
// ==============================
console.log("🔑 JWT_SECRET đang dùng:", process.env.JWT_SECRET || "❌ Không có giá trị!");

// Kiểm tra xem biến môi trường có được load hay chưa
console.log("🧩 Kiểm tra biến môi trường:");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✅ Có giá trị" : "❌ Không có giá trị");

// ==============================
// 🚀 KHỞI TẠO ỨNG DỤNG EXPRESS
// ==============================
const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// ⚙️ CẤU HÌNH PORT & MONGO URI
// ==============================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ==============================
// 🧠 KẾT NỐI MONGODB ATLAS
// ==============================
mongoose
  .connect(MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  })
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ==============================
// 🔗 ROUTES
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Server backend đang hoạt động!");
});

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// ==============================
// 📨 ROUTE KIỂM TRA GỬI MAIL (TEST)
// ==============================
app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Node Server" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email NodeJS",
      text: "✅ Gửi mail thành công! Cấu hình Gmail SMTP hoạt động tốt.",
    });

    res.json({ message: "✅ Gửi email thành công!" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({
      message: "Không gửi được email",
      error: error.message,
    });
  }
});

// ==============================
// 🚀 KHỞI ĐỘNG SERVER
// ==============================
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
