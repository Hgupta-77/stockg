const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { email, password, planType } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with optional planType
    const newUser = new User({
      email,
      password: hashedPassword,
      planType: planType === "Premium" ? "Premium" : "Free",
    });
    await newUser.save();

    console.log("✅ User registered:", newUser.email);

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    // Generate JWT with plan info
    const token = jwt.sign(
      { id: user._id, email: user.email, planType: user.planType },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // ✅ Return consistent user info
    res.json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        planType: user.planType,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
