import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// ✅ API cá nhân
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

// ✅ API admin
router.get("/user", verifyToken, getAllUsers);

export default router;
