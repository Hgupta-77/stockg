const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================
// REGISTER
// ============================
router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }
    email = email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, planType: "Free" });
    await newUser.save();

    return res.status(201).json({ success: true, msg: "Registration successful" });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, msg: "Something went wrong during registration" });
  }
});

// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, msg: "Email and password required" });

    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, msg: "No account found" });

    if (!user.password) return res.status(400).json({ success: false, msg: "Use Google login for this account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, msg: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email, planType: user.planType }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });
    user.lastLogin = new Date();
    await user.save();

    return res.json({ success: true, msg: "Login successful", token, user: { id: user._id, email: user.email, planType: user.planType } });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ============================
// GOOGLE LOGIN
// ============================
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, msg: "Google credential missing" });

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, password: null, googleId: payload.sub, planType: "Free" });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, planType: user.planType }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });

    return res.json({ success: true, msg: "Google login successful", token, user: { id: user._id, email: user.email, planType: user.planType } });

  } catch (error) {
    console.error("Google login error:", error.message);
    return res.status(500).json({ success: false, msg: "Google authentication failed" });
  }
});

module.exports = router;