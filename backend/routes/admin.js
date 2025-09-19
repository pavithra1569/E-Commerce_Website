const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to check JWT and admin access
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // Check if user is admin (you can modify this logic)
    User.findById(req.userId).then(user => {
      if (!user || user.email !== 'admin@shopsphere.com') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    }).catch(() => {
      res.status(401).json({ error: 'Invalid token' });
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
