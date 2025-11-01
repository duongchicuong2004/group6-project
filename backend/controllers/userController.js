import bcrypt from "bcrypt";
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
    // Kiểm tra quyền Admin (case-insensitive)
    if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập danh sách người dùng!",
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

// ✅ Tạo user mới (Admin)
export const createUser = async (req, res) => {
  try {
    if (!req.user || String(req.user.role).toLowerCase() !== "admin")
 {
      return res.status(403).json({ message: "Bạn không có quyền tạo user!" });
    }

    const { name, username, full_name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại!" });

    const userNameToUse = username || (email ? email.split("@")[0] : name || "user");
    const hashed = await bcrypt.hash(password || "123456", 10);

    const newUser = new User({
      username: userNameToUse,
      full_name: full_name || name || "",
      email,
      password: hashed,
      role: role || "User",
    });

    await newUser.save();
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ message: "Tạo user thành công!", user: userData });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Không thể tạo user!" });
  }
};

// ✅ Cập nhật user bởi Admin (PUT /user/:id)
export const updateUserByAdmin = async (req, res) => {
  try {
    // Chỉ Admin mới được quyền chỉnh sửa user
    if (!req.user || String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật user!" });
    }

    const userId = req.params.id;
    const { username, full_name, email, phone, address, password, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    // ✅ Không cho phép admin tự hạ cấp mình
    if (userId === req.user.id && role && role.toLowerCase() !== "admin") {
      return res.status(400).json({ message: "Không thể thay đổi vai trò của chính bạn!" });
    }

    // ✅ Chỉ cho phép role hợp lệ
    const allowedRoles = ["user", "moderator", "admin"];
    if (role && !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Vai trò không hợp lệ! (chỉ: User, Moderator, Admin)" });
    }

    // ✅ Cập nhật thông tin cơ bản
    user.username = username || user.username;
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // ✅ Cập nhật role (nếu có)
    if (role) user.role = role;

    // ✅ Cập nhật mật khẩu nếu có
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: "Cập nhật thành công!", user: userData });

  } catch (error) {
    console.error("Error in updateUserByAdmin:", error);
    res.status(500).json({ message: "Không thể cập nhật user!" });
  }
};


// ✅ Xóa người dùng (Admin only)
export const deleteUser = async (req, res) => {
  try {
    // Kiểm tra quyền Admin
         if (!req.user || String(req.user.role).toLowerCase() !== "admin")
 {
      return res.status(403).json({ message: "Bạn không có quyền xoá user!" });
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
