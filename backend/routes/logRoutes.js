import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";
import Log from "../models/Log.js";

const router = express.Router();

// 🔍 Xem tất cả log (chỉ Admin)
router.get("/", verifyToken, checkRole("Admin"), async (req, res) => {
  try {
    const logs = await Log.find().populate("userId", "email role");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi truy vấn log!" });
  }
});

export default router;
