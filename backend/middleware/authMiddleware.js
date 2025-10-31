import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file .env từ thư mục backend
dotenv.config({ path: path.join(__dirname, "../.env") });

// Sử dụng ACCESS_TOKEN_SECRET thay vì JWT_SECRET
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token xác thực!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🟢 [verifyToken] Header hợp lệ, đang xác thực...");
    console.log("🔑 ACCESS_SECRET:", ACCESS_SECRET);

    const decoded = jwt.verify(token, ACCESS_SECRET);
    console.log("✅ Token hợp lệ, decoded:", decoded);

    // Tìm người dùng trong DB
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.warn("⚠️ Không tìm thấy người dùng:", decoded.id);
      return res.status(401).json({ message: "Người dùng không tồn tại!" });
    }

    console.log("👤 Người dùng xác thực:", {
      id: req.user._id.toString(),
      role: req.user.role,
    });

    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
