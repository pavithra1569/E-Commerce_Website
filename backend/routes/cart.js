const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to check JWT
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

// Add product to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) cart = await Cart.create({ userId: req.userId, items: [] });
    
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
    await cart.save();
    res.json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add product to cart' });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
  res.json(cart || { items: [] });
});

module.exports = router;