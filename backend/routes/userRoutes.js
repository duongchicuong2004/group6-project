import express from "express";
import User from "../models/User.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ========================================
   🧍‍♂️ PROFILE (GET + PUT)
   Chỉ chính user mới được xem hoặc cập nhật profile
======================================== */
router.get("/profile/:id", verifyToken, getProfile);
router.put("/profile/:id", verifyToken, updateProfile);

/* ========================================
   👑 ADMIN - QUẢN LÝ USER
   - Xem danh sách tất cả user (Admin)
   - Xóa tài khoản (Admin hoặc chính chủ)
======================================== */

// 🧾 Lấy danh sách user (chỉ Admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách user", error: error.message });
  }
});

// ❌ Xóa user (Admin hoặc chính chủ)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User không tồn tại" });

    // 🛑 Chỉ Admin hoặc chính chủ được xóa
    if (req.user.role !== "Admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa user này!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User đã bị xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa user", error: error.message });
  }
});

/* ========================================
   🧩 CRUD CƠ BẢN KHÁC (nếu cần)
   ⚠️ Có thể bỏ qua nếu chỉ dùng cho Admin
======================================== */
// ➕ Thêm user mới (Admin có thể thêm)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Thêm user thành công", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm user", error: error.message });
  }
});

// ✏️ Cập nhật user (Admin hoặc chính chủ)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật user này!" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User không tồn tại" });

    res.json({ message: "Cập nhật user thành công", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật user", error: error.message });
  }
});

export default router;
