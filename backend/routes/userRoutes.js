// 📁 D:\Buoi4\group6-project\backend\routes\userRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🧾 GET: lấy danh sách user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➕ POST: thêm user mới
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✏️ PUT: cập nhật user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User không tồn tại" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ❌ DELETE: xóa user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User không tìm thấy" });
    res.json({ message: "User đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
