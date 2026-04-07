// --------------------------------
// Load Environment Variables
// --------------------------------
require("dotenv").config();

// --------------------------------
// Import Packages
// --------------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --------------------------------
// Create App
// --------------------------------
const app = express();

// --------------------------------
// Middlewares
// --------------------------------
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// --------------------------------
// Routes Import
// --------------------------------
const authRoutes = require("./routes/auth");
const sharesRoutes = require("./routes/shares");
const subsRoutes = require("./routes/subscription");
const stocksRoutes = require("./routes/stocks");

// --------------------------------
// MongoDB Connection
// --------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();

// --------------------------------
// Health Check Route
// --------------------------------
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Stock Server Running",
  });
});

// --------------------------------
// API Routes
// --------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/shares", sharesRoutes);
app.use("/api/subscription", subsRoutes);
app.use("/api/stocks", stocksRoutes);

// --------------------------------
// Global Error Handler
// --------------------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// --------------------------------
// Start Server
// --------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});