// 📁 routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import User from "../models/User.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

/* ================================
   🧾 Đăng ký (Signup)
================================ */
router.post("/signup", async (req, res) => {
  try {
    const { username, full_name, email, phone, address, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      return res.status(400).json({ message: "Email hoặc username đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email hoặc mật khẩu không đúng!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });

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

/* ================================
   🔑 Quên mật khẩu (Forgot Password)
================================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.tokenExpire = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Cấu hình gửi email (dùng Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.full_name || user.username},</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Hãy nhấn vào liên kết sau để đặt lại mật khẩu:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><i>Liên kết có hiệu lực trong 1 giờ.</i></p>
      `,
    });

    res.json({ message: "Đã gửi email đặt lại mật khẩu!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🔄 Đặt lại mật khẩu (Reset Password)
================================ */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      tokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.tokenExpire = null;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🖼️ Upload Avatar (Cloudinary)
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const upload = multer({ dest: "uploads/" });

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      public_id: email.split("@")[0],
      overwrite: true,
    });

    fs.unlinkSync(req.file.path); // Xóa file tạm

    user.avatarUrl = uploadResult.secure_url;
    await user.save();

    res.json({
      message: "Cập nhật avatar thành công!",
      avatarUrl: uploadResult.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi upload avatar!", error: error.message });
  }
});

export default router;
