import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 5, // chỉ cho phép 5 lần thử đăng nhập sai
  message: {
    message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 5 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter; // 👈 ĐẢM BẢO DÒNG NÀY CÓ