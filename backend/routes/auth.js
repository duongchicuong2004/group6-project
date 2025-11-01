import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { refreshToken, logout } from "../controllers/authController.js";
import loginLimiter from "../middleware/rateLimitLogin.js";
import { logActivity } from "../middleware/logActivity.js"; // ✅ Thêm log

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const router = express.Router();
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";

/* ================================
   ☁️ Cloudinary Config
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("🔧 Kiểm tra Cloudinary ENV:");
console.log({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Có" : "❌ Thiếu",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Có" : "❌ Thiếu",
});

const upload = multer({ dest: "uploads/" });

/* ================================
   🧾 Đăng ký
================================ */
router.post("/signup", async (req, res) => {
  try {
    const { username, full_name, email, phone, address, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Email hoặc username đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      full_name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: role || "User",
    });

    await logActivity("REGISTER")(req, res, () => {});
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🔐 Đăng nhập (CÓ rate limit)
================================ */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email hoặc mật khẩu không đúng!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    const refreshTokenValue = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key",
      { expiresIn: "7d" }
    );

    await RefreshToken.deleteMany({ userId: user._id });
    await RefreshToken.create({ userId: user._id, token: refreshTokenValue });

    await logActivity("LOGIN")(req, res, () => {});

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken: refreshTokenValue,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   🔑 Quên mật khẩu
================================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.tokenExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
    const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Nhấn vào liên kết để đặt lại mật khẩu:</p>
             <a href="${resetLink}" target="_blank">${resetLink}</a>
             <p><i>Liên kết có hiệu lực trong 1 giờ.</i></p>`,
    });

    await logActivity("FORGOT_PASSWORD")(req, res, () => {});
    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({ message: "Lỗi khi gửi email!", error: error.message });
  }
});

/* ================================
   🔁 Đặt lại mật khẩu
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

    await logActivity("RESET_PASSWORD")(req, res, () => {});
    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi reset mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

/* ================================
   ☁️ Upload Avatar
================================ */
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Không có file được tải lên!" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      public_id: email.split("@")[0],
      overwrite: true,
    });

    fs.unlinkSync(req.file.path);
    user.avatarUrl = uploadResult.secure_url;
    await user.save();

    await logActivity("UPLOAD_AVATAR")(req, res, () => {});
    res.json({
      message: "Cập nhật avatar thành công!",
      avatarUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("❌ Lỗi upload avatar:", error);
    res.status(500).json({ message: "Lỗi upload avatar!", error: error.message });
  }
});

/* ================================
   🔁 Refresh Token & Logout
================================ */
router.post("/refresh", refreshToken);
router.post("/logout", async (req, res) => {
  await logActivity("LOGOUT")(req, res, () => {});
  logout(req, res);
});

export default router;