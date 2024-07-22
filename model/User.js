// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs/dist/bcrypt.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: String, default: "system" },
  updatedDate: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "system" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export const User = mongoose.model("User", userSchema);
