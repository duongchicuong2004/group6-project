// ====== Import các module cần thiết ======
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes"); // Import route user

// ====== Khởi tạo ứng dụng Express ======
const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Kết nối MongoDB Atlas ======
const uri = "mongodb+srv://group6user:Group6%402025@cluster6project.p4s7w6s.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster6Project";

// Kết nối tới MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ====== Gắn route chính ======
app.use("/users", userRoutes);

// ====== Route test đơn giản ======
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running...");
});

// ====== Chạy server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
