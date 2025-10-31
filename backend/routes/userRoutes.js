import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";
import { logActivity } from "../middleware/logActivity.js";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  createUser,
  updateUserByAdmin,
} from "../controllers/userController.js";

const router = express.Router();

/* ======================================
   👤 API NGƯỜI DÙNG CÁ NHÂN
   (Tất cả user đã đăng nhập)
====================================== */

// 📄 Lấy thông tin cá nhân
router.get(
  "/profile",
  verifyToken,
  logActivity("Xem hồ sơ cá nhân"),
  getProfile
);

// ✏️ Cập nhật thông tin cá nhân
router.put(
  "/profile",
  verifyToken,
  logActivity("Cập nhật hồ sơ cá nhân"),
  updateProfile
);

/* ======================================
   👑 API QUẢN TRỊ (RBAC nâng cao)
====================================== */

// 🧾 Lấy danh sách tất cả user
// Quyền: Admin & Moderator
router.get(
  "/",
  verifyToken,
  checkRole("Admin", "Moderator"),
  logActivity("Xem danh sách người dùng"),
  getAllUsers
);

// ➕ Tạo user mới
// Quyền: chỉ Admin
router.post(
  "/",
  verifyToken,
  checkRole("Admin"),
  logActivity("Tạo người dùng mới"),
  createUser
);

// 🛠️ Cập nhật thông tin user khác
// Quyền: chỉ Admin
router.put(
  "/:id",
  verifyToken,
  checkRole("Admin"),
  logActivity("Cập nhật thông tin người dùng khác"),
  updateUserByAdmin
);

// 🗑️ Xóa user
// Quyền: chỉ Admin
router.delete(
  "/:id",
  verifyToken,
  checkRole("Admin"),
  logActivity("Xóa người dùng"),
  deleteUser
);

/* ======================================
   🪵 API LOG HOẠT ĐỘNG (Admin xem nhật ký)
====================================== */

import Log from "../models/Log.js"; // ✅ Import model Log

router.get(
  "/logs",
  verifyToken,
  checkRole("Admin"),
  logActivity("Xem nhật ký hệ thống"),
  async (req, res) => {
    try {
      // ✅ Populate để hiện cả tên người dùng thay vì chỉ ID
      const logs = await Log.find()
        .populate("userId", "name email role")
        .sort({ timestamp: -1 });
      res.json(logs);
    } catch (error) {
      console.error("❌ Lỗi khi lấy logs:", error);
      res.status(500).json({ message: "Lỗi khi lấy nhật ký hoạt động" });
    }
  }
);

export default router;
