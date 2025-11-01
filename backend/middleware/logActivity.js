import Log from "../models/Log.js";

// ✅ Middleware ghi log, an toàn cả khi chưa có user đăng nhập
export const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id || null;
      const timestamp = new Date();

      // ✅ Chỉ ghi log khi có userId (đã xác thực)
      if (userId) {
        await Log.create({ userId, action, timestamp });
        console.log(`📘 [LOG] ${userId} - ${action}`);
      } else {
        console.log(`📘 [LOG] Guest - ${action}`);
      }
      next();
    } catch (error) {
      console.error("❌ Error saving log:", error.message);
      next(); // vẫn cho phép request tiếp tục
    }
  };
};
