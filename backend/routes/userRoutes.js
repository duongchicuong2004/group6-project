import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";
import { logActivity } from "../middleware/logActivity.js"; // ✅ chuẩn bị cho Hoạt động 5
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
   👤 API người dùng cá nhân
   (Tất cả user đã đăng nhập)
====================================== */

// 📄 Lấy thông tin cá nhân
router.get("/profile", verifyToken, logActivity("Xem hồ sơ cá nhân"), getProfile);

// ✏️ Cập nhật thông tin cá nhân
router.put("/profile", verifyToken, logActivity("Cập nhật hồ sơ cá nhân"), updateProfile);


/* ======================================
   👑 API quản trị (RBAC nâng cao)
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

export default router;
