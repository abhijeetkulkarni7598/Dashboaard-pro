const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  lastLogin: Date,
  role: { type: String, default: "user" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  activities: [{ action: String, timestamp: Date }],
  notifications: [
    {
      message: String,
      timestamp: Date,
    },
],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
