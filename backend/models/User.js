
// D:\Buoi4\group6-project\backend\models\User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);

