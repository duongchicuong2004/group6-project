const loginAttempts = new Map(); // { IP: { count, lastAttempt } }

export const rateLimitLogin = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

  // Reset nếu quá 5 phút
  if (now - attempt.lastAttempt > 5 * 60 * 1000) {
    attempt.count = 0;
  }

  attempt.count++;
  attempt.lastAttempt = now;
  loginAttempts.set(ip, attempt);

  if (attempt.count > 5) {
    console.warn(`🚨 IP ${ip} bị chặn do login quá nhiều lần`);
    return res.status(429).json({
      message: "Đăng nhập quá nhiều lần. Vui lòng thử lại sau 5 phút.",
    });
  }

  next();
};
