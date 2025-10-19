import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// ⚙️ Cấu hình trực tiếp (bỏ dotenv)
const PORT = 5000;
const MONGO_URI =
  "mongodb+srv://group6user:Group6%402025@cluster6project.p4s7w6s.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster6Project";

// 🧠 Kết nối MongoDB Atlas
mongoose
  .connect(MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  })
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 🔗 Route test
app.get("/", (req, res) => {
  res.send("🚀 Server backend đang hoạt động!");
});

// 👇 Gắn route /user và /auth
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// 🚀 Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
