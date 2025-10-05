const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
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

// Place order from cart with dynamic payment
router.post('/', auth, async (req, res) => {
  try {
    const { paymentMethod = 'card', transactionId } = req.body || {};
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    // Compute total and snapshot items either from server cart or from client-sent items
    let total = 0;
    let orderItems = [];

    if (cart && cart.items.length > 0) {
      orderItems = cart.items.map(ci => {
        const priceStr = (ci.productId?.price ?? 0).toString();
        const unit = typeof ci.productId?.price === 'string'
          ? parseFloat(priceStr.replace(/[^0-9.]/g, ''))
          : Number(ci.productId?.price || 0);
        const qty = ci.quantity || 1;
        total += unit * qty;
        return {
          productId: ci.productId?._id,
          quantity: qty,
          price: unit,
          name: ci.productId?.name,
          image: ci.productId?.image,
        };
      });
    } else if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      // Fallback: accept client-provided cart items
      orderItems = req.body.items.map(it => {
        const unit = typeof it.price === 'string'
          ? parseFloat(String(it.price).replace(/[^0-9.]/g, ''))
          : Number(it.price || 0);
        const qty = it.quantity || 1;
        total += unit * qty;
        return {
          productId: it.productId, // optional
          quantity: qty,
          price: unit,
          name: it.name,
          image: it.image,
        };
      });
    } else {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Determine payment status
    let paymentStatus = 'pending';
    if (paymentMethod === 'cod') {
      paymentStatus = 'cod_pending';
    } else {
      // simulate successful online payment if transactionId present
      paymentStatus = transactionId ? 'paid' : 'pending';
    }

    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      total,
      status: paymentMethod === 'cod' ? 'processing' : (paymentStatus === 'paid' ? 'processing' : 'pending'),
      paymentMethod,
      paymentStatus,
      transactionId,
    });

    // Clear server cart if exists
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;