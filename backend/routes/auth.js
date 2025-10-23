// 📁 routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

/* ================================
   🧾 Đăng ký (Signup)
================================ */
router.post("/signup", async (req, res) => {
  try {
    const { username, full_name, email, phone, address, password, role } = req.body;

    // 🔎 Kiểm tra email hoặc username trùng
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      return res.status(400).json({ message: "Email hoặc username đã tồn tại!" });

    // 🔒 Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑‍💻 Tạo user mới (role mặc định là "User")
    const newUser = new User({
      username,
      full_name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: role || "User",
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🔐 Đăng nhập (Login)
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Tìm user theo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email hoặc mật khẩu không đúng!" });

    // 🔑 Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });

    // 🎫 Tạo token JWT chứa role
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🚪 Đăng xuất (client tự xóa token)
================================ */
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công (client xóa token)!" });
});

export default router;
