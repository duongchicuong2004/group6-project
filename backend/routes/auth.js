import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET_KEY = "your_jwt_secret_key"; // hoặc lưu trong .env

// Đăng ký
router.post("/signup", async (req, res) => {
  try {
    const { username, full_name, email, phone, address, password } = req.body;

    // Kiểm tra username hoặc email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      username,
      full_name,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo username
   const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Tên đăng nhập không tồn tại!" });

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Sai mật khẩu!" });

    // Tạo token (không có role)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Đăng xuất (client tự xóa token)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công (client xóa token)!" });
});

export default router;
