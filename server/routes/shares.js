const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { shares } = require('../store');

// helper id
const genId = () => Date.now().toString() + Math.random().toString(36).slice(2,7);

// Create share (auth)
router.post('/', auth, (req, res) => {
  const ownerId = req.user.id;
  const { symbol, name, price=0, sector='general', notes='', color='' } = req.body;
  if (!symbol || !name) return res.status(400).json({ message: 'Symbol and name required' });

  const newShare = {
    id: genId(),
    symbol,
    name,
    price: Number(price),
    sector,
    notes,
    color,
    ownerId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  shares.unshift(newShare);
  res.json(newShare);
});

// Get all shares for user
router.get('/', auth, (req, res) => {
  const ownerId = req.user.id;
  const myShares = shares.filter(s => s.ownerId === ownerId);
  res.json(myShares);
});

// Update
router.put('/:id', auth, (req, res) => {
  const ownerId = req.user.id;
  const id = req.params.id;
  const idx = shares.findIndex(s => s.id === id && s.ownerId === ownerId);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const s = shares[idx];
  const { symbol, name, price, sector, notes, color } = req.body;
  shares[idx] = {
    ...s,
    symbol: symbol ?? s.symbol,
    name: name ?? s.name,
    price: price !== undefined ? Number(price) : s.price,
    sector: sector ?? s.sector,
    notes: notes ?? s.notes,
    color: color ?? s.color,
    updatedAt: new Date()
  };
  res.json(shares[idx]);
});

// Delete
router.delete('/:id', auth, (req, res) => {
  const ownerId = req.user.id;
  const id = req.params.id;
  const idx = shares.findIndex(s => s.id === id && s.ownerId === ownerId);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  shares.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
