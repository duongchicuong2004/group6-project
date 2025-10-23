import User from "../models/User.js";

// ✅ Lấy thông tin cá nhân
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tải thông tin cá nhân!" });
  }
};

// ✅ Cập nhật thông tin cá nhân
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin!" });
  }
};

// ✅ Lấy tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể tải danh sách người dùng!" });
  }
};
