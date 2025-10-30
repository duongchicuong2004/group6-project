import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";

// =======================
// ⚙️ Cấu hình chung
// =======================
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

// =======================
// 📌 Đăng ký (Sign Up)
// =======================
export const signup = async (req, res) => {
  try {
    const { username, full_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      full_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// =======================
// 📌 Đăng nhập (Login)
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// =======================
// 📌 Đăng xuất (Logout)
// =======================
export const logout = (req, res) => {
  res.status(200).json({
    message: "Đăng xuất thành công (client tự xóa token phía frontend)",
  });
};

// =======================
// 📌 Quên mật khẩu (Forgot Password)
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    // Tạo token ngẫu nhiên
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.tokenExpire = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    // Kiểm tra thông tin cấu hình Gmail
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message:
          "Thiếu cấu hình email! Hãy thêm EMAIL_USER và EMAIL_PASS trong file .env",
      });
    }

    // Cấu hình SMTP Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Gửi email
    await transporter.sendMail({
      from: `"Hệ thống Group 6" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.full_name || user.username},</h3>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu (có hiệu lực trong 1 giờ):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <br><br>
        <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.</p>
      `,
    });

    res.json({ message: "✅ Đã gửi email đặt lại mật khẩu!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// =======================
// 📌 Đặt lại mật khẩu (Reset Password)
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      tokenExpire: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.tokenExpire = null;
    await user.save();

    res.json({ message: "✅ Đặt lại mật khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// =======================
// 📌 Upload Avatar (Cloudinary)
// =======================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const upload = multer({ dest: "uploads/" });
export const uploadAvatarMiddleware = upload.single("avatar");

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file?.path;
    const { email } = req.body;

    if (!file) return res.status(400).json({ message: "Không có file được tải lên!" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const result = await cloudinary.uploader.upload(file, {
      folder: "avatars",
      public_id: email.split("@")[0],
      overwrite: true,
    });

    user.avatarUrl = result.secure_url;
    await user.save();

    res.json({
      message: "✅ Cập nhật avatar thành công!",
      avatarUrl: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
