// ==============================
// 📦 IMPORT CÁC MODULE CẦN THIẾT
// ==============================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// Import các routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

// ==============================
// ⚙️ CẤU HÌNH .ENV
// ==============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "./.env") });

// ==============================
// 🚀 KHỞI TẠO EXPRESS APP
// ==============================
const app = express();

// Middleware quan trọng 🔥
app.use(cors());
app.use(express.json()); // Đọc JSON từ body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ form-data

// ==============================
// ⚙️ KIỂM TRA BIẾN MÔI TRƯỜNG
// ==============================
console.log("🧩 ENV CHECK:");
console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI ? "✅ Có" : "❌ Thiếu");
console.log("ACCESS_TOKEN_SECRET =", process.env.ACCESS_TOKEN_SECRET ? "✅ Có" : "❌ Thiếu");
console.log("REFRESH_TOKEN_SECRET =", process.env.REFRESH_TOKEN_SECRET ? "✅ Có" : "❌ Thiếu");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✅ Có" : "❌ Thiếu");
console.log("CLOUDINARY_CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME || "❌ Thiếu");

// ==============================
// ⚙️ PORT & MONGO CONFIG
// ==============================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ==============================
// 🧠 KẾT NỐI MONGODB ATLAS
// ==============================
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ==============================
// 🔗 ROUTES
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Server backend đang hoạt động ổn định!");
});

// Các route chính
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// ==============================
// 📨 TEST ROUTE: GỬI EMAIL KIỂM TRA SMTP
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
      from: `"Backend Server" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "✅ Test Email từ NodeJS",
      text: "Thành công! Cấu hình SMTP Gmail hoạt động tốt.",
    });

    res.json({ message: "✅ Email gửi thành công!" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({
      message: "Không gửi được email!",
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
