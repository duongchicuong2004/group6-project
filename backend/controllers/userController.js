// controllers/userController.js

// Mảng tạm để lưu người dùng (giả lập database)
let users = [
  { id: 1, name: "Nguyen Van A", email: "a@gmail.com" },
  { id: 2, name: "Tran Thi B", email: "b@gmail.com" }
];

// === GET /users ===
const getUsers = (req, res) => {
  res.json(users);
};

// === POST /users ===
const addUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Thiếu name hoặc email" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

// Xuất module để route gọi được
module.exports = { getUsers, addUser };
