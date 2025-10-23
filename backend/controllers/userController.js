import bcrypt from "bcrypt";
import User from "../models/User.js";

// === GET /users ===
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// === POST /users (Đăng ký) ===
export const addUser = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Thiếu name, email hoặc password" });

    // 🔒 Mã hoá mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Thêm user thất bại", error: error.message });
  }
};

// === POST /login ===
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // ✅ So sánh mật khẩu nhập vào với mật khẩu mã hoá trong DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Sai mật khẩu!" });

    res.json({ message: "Đăng nhập thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// === GET /user/profile/:id ===
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
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
    const userId = req.params.id;
    const { name, email, phone, address, password } = req.body;

    // Tạo object lưu thông tin cần cập nhật
    const updateData = { name, email, phone, address };

    // 🔒 Nếu người dùng đổi mật khẩu → mã hóa lại
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Cập nhật thất bại", error: error.message });
  }
};
