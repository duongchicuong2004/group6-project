import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // hoặc link Render backend của bạn
});

// ✅ Thêm token vào header cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Tự động refresh token khi accessToken hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn → gọi /auth/refresh 1 lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:5000/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
