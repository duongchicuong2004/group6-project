import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    full_name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["User","Moderator", "Admin"],
      default: "User",
    },
    // === Thêm các trường hỗ trợ chức năng nâng cao ===
    resetToken: { type: String, default: null },
    tokenExpire: { type: Date, default: null },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
