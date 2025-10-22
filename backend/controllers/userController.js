import User from "../models/User.js"; // đảm bảo bạn đã có models/User.js

// === GET /users ===
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // bỏ password nếu có
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// === POST /users ===
export const addUser = async (req, res) => {
  try {
    const { username, full_name, email, phone, address, password } = req.body;
    if (!username || !email)
      return res.status(400).json({ message: "Thiếu username hoặc email" });

    const newUser = new User({ username, full_name, email, phone, address, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Thêm user thất bại", error: error.message });
  }
};

// === GET /user/profile/:id ===
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // <-- Lấy id từ URL
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// === PUT /user/profile/:id ===
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id; // <-- Lấy id từ URL
    const { full_name, email, phone, address } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { full_name, email, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Cập nhật thất bại", error: error.message });
  }
};

