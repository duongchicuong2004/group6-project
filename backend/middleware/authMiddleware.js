import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

// 🧩 Kiểm tra token hợp lệ
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Thiếu token xác thực!" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// 👑 Middleware kiểm tra quyền Admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ message: "Chỉ Admin mới có quyền truy cập!" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
