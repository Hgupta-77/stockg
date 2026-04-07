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
      default: null, // ✅ Google login ke liye password optional
      minlength: 6,
    },

    googleId: {
      type: String,
      default: null, // ✅ Google OAuth user id
    },

    planType: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Fast email lookup
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);