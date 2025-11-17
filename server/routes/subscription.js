const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { users } = require('../store');

// subscribe endpoint (no real payment)
// body: { tier: 'basic'|'pro', months: number }
router.post('/subscribe', auth, (req, res) => {
  const userId = req.user.id;
  const { tier, months = 1 } = req.body;
  const valid = ['free','basic','pro'];
  if (!valid.includes(tier)) return res.status(400).json({ message: 'Invalid tier' });

  const u = users.find(x => x.id === userId);
  if (!u) return res.status(404).json({ message: 'User not found' });

  // set plan and expiry
  const now = new Date();
  const currentExpiry = u.expiresAt ? new Date(u.expiresAt) : null;
  let start = now;
  if (currentExpiry && currentExpiry > now) start = currentExpiry; // extend from current expiry
  const newExpiry = new Date(start);
  newExpiry.setMonth(newExpiry.getMonth() + Number(months));

  u.plan = tier;
  u.expiresAt = newExpiry;
  u.updatedAt = new Date();

  // return updated safe user
  const safeUser = { id: u.id, name: u.name, email: u.email, plan: u.plan, expiresAt: u.expiresAt };
  res.json({ message: 'Subscribed', user: safeUser });
});

// check subscription status
router.get('/status', auth, (req, res) => {
  const userId = req.user.id;
  const u = users.find(x => x.id === userId);
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json({ plan: u.plan, expiresAt: u.expiresAt });
});

module.exports = router;
