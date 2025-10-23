import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token xác thực!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Người dùng không tồn tại!" });
    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    res.status(403).json({ message: "Token không hợp lệ!" });
  }
};
