import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file .env từ thư mục backend
dotenv.config({ path: path.join(__dirname, "../.env") });

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token xác thực!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log('verifyToken: Authorization header present');
    console.log('🔑 SECRET_KEY dùng để verify:', SECRET_KEY);

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('verifyToken: decoded token:', decoded);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.warn('verifyToken: user not found for id', decoded.id);
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    console.log('verifyToken: authenticated user:', {
      id: req.user._id.toString(),
      role: req.user.role,
    });

    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    res.status(403).json({ message: "Token không hợp lệ!" });
  }
};
