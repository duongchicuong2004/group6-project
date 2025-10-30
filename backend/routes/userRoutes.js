import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, getAllUsers, deleteUser, createUser, updateUserByAdmin } from "../controllers/userController.js";

const router = express.Router();

// ✅ API cá nhân
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

// ✅ API admin
router.get("/", verifyToken, getAllUsers);
router.post("/", verifyToken, createUser);
router.put("/:id", verifyToken, updateUserByAdmin);
router.delete("/:id", verifyToken, deleteUser);

export default router;
