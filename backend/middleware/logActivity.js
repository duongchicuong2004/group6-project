import Log from "../models/Log.js";

// ✅ Hàm logActivity(action) trả về middleware (req, res, next)
export const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id || null;
      const timestamp = new Date();

      await Log.create({ userId, action, timestamp });

      console.log(`📘 [LOG] ${userId || "Guest"} - ${action}`);
      next();
    } catch (error) {
      console.error("❌ Error saving log:", error);
      next(); // vẫn cho phép request tiếp tục
    }
  };
};
