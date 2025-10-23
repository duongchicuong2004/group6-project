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
    const { name, full_name, email, phone, address, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

  // prefer `full_name` if provided (frontend sends full_name)
  user.full_name = full_name || name || user.full_name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();
    // return updated user (without password)
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: "Cập nhật thành công!", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin!" });
  }
};

// ✅ Lấy tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
  try {
    // Kiểm tra quyền Admin
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ 
        message: "Bạn không có quyền truy cập danh sách người dùng!"
      });
    }

    const users = await User.find().select("-password");
    console.log('Found users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: "Không thể tải danh sách người dùng!" });
  }
};

// ✅ Xóa người dùng (Admin only)
export const deleteUser = async (req, res) => {
  try {
    // Kiểm tra quyền Admin
    if (!req.user || req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Bạn không có quyền xóa người dùng!" });
    }

    const userId = req.params.id;

    // Kiểm tra xem có đang tự xóa mình không
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Không thể tự xóa tài khoản admin!" });
    }

    // Tìm và xóa user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Không thể xóa người dùng!" });
  }
};
