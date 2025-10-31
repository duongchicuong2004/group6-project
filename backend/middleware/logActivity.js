// middleware/logActivity.js
import Log from "../models/Log.js";

export const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id || null;
      const email = req.user?.email || "Guest";
      const timestamp = new Date();

      await Log.create({ userId, email, action, timestamp });

      console.log(`📘 [LOG] ${email} - ${action}`);
      next();
    } catch (error) {
      console.error("❌ Error saving log:", error);
      next(); // vẫn cho phép request tiếp tục
    }
  };
};
