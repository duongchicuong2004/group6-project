import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  full_name: String,
  email: String,
  phone: String,
  address: String,
  password: String,
});

export default mongoose.model("User", userSchema);
