const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Place order from cart
router.post('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  const order = await Order.create({
    userId: req.userId,
    items: cart.items,
  });
  cart.items = [];
  await cart.save();
  res.json({ success: true, order });
});

module.exports = router;