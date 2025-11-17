const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    planType: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free", // ✅ Default plan
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null, // ✅ optional tracking for user activity
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt & updatedAt
    versionKey: false, // ✅ Removes __v
  }
);

// ✅ Faster lookup for login & queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
