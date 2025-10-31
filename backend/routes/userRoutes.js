import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js"; // ✅ Thêm middleware kiểm tra quyền
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
   👤 API cá nhân (User có thể tự xem/sửa)
====================================== */
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

/* ======================================
   👑 API quản trị (Chỉ cho Admin/Moderator)
====================================== */

// 🧾 Lấy danh sách tất cả user (Admin, Moderator)
router.get("/", verifyToken, checkRole("Admin", "Moderator"), getAllUsers);

// ➕ Tạo user mới (Admin)
router.post("/", verifyToken, checkRole("Admin"), createUser);

// 🛠️ Admin chỉnh sửa thông tin user
router.put("/:id", verifyToken, checkRole("Admin"), updateUserByAdmin);

// 🗑️ Admin xóa user
router.delete("/:id", verifyToken, checkRole("Admin"), deleteUser);

export default router;
