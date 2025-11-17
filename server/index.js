// Load .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes Import
const authRoutes = require('./routes/auth');
const sharesRoutes = require('./routes/shares');
const subsRoutes = require('./routes/subscription');
const stocksRoutes = require('./routes/stocks');  // 🔥 Live Stock API

// --------------------------------
// 🔥 MongoDB Connection
// --------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --------------------------------
// 🔥 Health Check Route
// --------------------------------
app.get('/', (req, res) => {
  res.send({ ok: true, msg: 'Stock server running with MongoDB' });
});

// --------------------------------
// 🔥 API Routes
// --------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/shares', sharesRoutes);
app.use('/api/subscription', subsRoutes);
app.use('/api/stocks', stocksRoutes);  // 👉 NIFTY / SENSEX / BANKNIFTY live

// --------------------------------
// 🔥 Start Server
// --------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
