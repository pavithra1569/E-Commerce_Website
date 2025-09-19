const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Sample products data for demonstration
const sampleProducts = {
  "Laptops": [
    { _id: '1', name: 'MacBook Pro 14-inch', price: '₹1,99,900', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', description: 'Powerful laptop for professionals' },
    { _id: '2', name: 'Dell XPS 13', price: '₹1,25,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop', description: 'Ultra-portable laptop' },
    { _id: '3', name: 'HP Spectre x360', price: '₹1,15,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', description: 'Convertible laptop with touch screen' }
  ],
  "Smartphones": [
    { _id: '4', name: 'iPhone 15 Pro', price: '₹1,34,900', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', description: 'Latest iPhone with Pro features' },
    { _id: '5', name: 'Samsung Galaxy S24', price: '₹89,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Flagship Android smartphone' },
    { _id: '6', name: 'Google Pixel 8', price: '₹75,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', description: 'Pure Android experience' }
  ],
  "Headphones": [
    { _id: '7', name: 'Sony WH-1000XM5', price: '₹29,990', category: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', description: 'Premium noise-cancelling headphones' },
    { _id: '8', name: 'Bose QuietComfort', price: '₹26,900', category: 'Headphones', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', description: 'Comfortable over-ear headphones' },
    { _id: '9', name: 'AirPods Pro', price: '₹24,900', category: 'Headphones', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', description: 'Wireless earbuds with ANC' }
  ],
  "Gaming": [
    { _id: '10', name: 'PlayStation 5', price: '₹54,990', category: 'Gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', description: 'Next-gen gaming console' },
    { _id: '11', name: 'Xbox Series X', price: '₹52,990', category: 'Gaming', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop', description: 'Powerful gaming console' },
    { _id: '12', name: 'Gaming Keyboard', price: '₹8,999', category: 'Gaming', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', description: 'Mechanical gaming keyboard' }
  ],
  "Smartwatches": [
    { _id: '13', name: 'Apple Watch Series 9', price: '₹45,900', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop', description: 'Advanced smartwatch' },
    { _id: '14', name: 'Samsung Galaxy Watch', price: '₹28,999', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', description: 'Feature-rich smartwatch' }
  ],
  "Tablets": [
    { _id: '15', name: 'iPad Pro', price: '₹81,900', category: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', description: 'Professional tablet' },
    { _id: '16', name: 'Samsung Galaxy Tab S9', price: '₹72,999', category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', description: 'Android tablet' }
  ],
  "Cameras": [
    { _id: '17', name: 'Canon EOS R5', price: '₹3,39,995', category: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', description: 'Professional mirrorless camera' },
    { _id: '18', name: 'Sony Alpha A7 IV', price: '₹2,48,990', category: 'Cameras', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop', description: 'Full-frame mirrorless camera' }
  ],
  "Audio": [
    { _id: '19', name: 'JBL Charge 5', price: '₹15,999', category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', description: 'Portable Bluetooth speaker' },
    { _id: '20', name: 'Marshall Acton II', price: '₹24,999', category: 'Audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop', description: 'Vintage-style speaker' }
  ],
  "Accessories": [
    { _id: '21', name: 'Anker Power Bank', price: '₹2,999', category: 'Accessories', image: 'https://images.unsplash.com/photo-1609592806787-3d9c4d4a7b0f?w=400&h=400&fit=crop', description: 'High-capacity power bank' },
    { _id: '22', name: 'Logitech MX Master 3', price: '₹8,495', category: 'Accessories', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', description: 'Wireless productivity mouse' }
  ]
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Try to get from database first
    const filter = category ? { category } : {};
    let products = await Product.find(filter);
    
    // If no products in database, use sample data
    if (products.length === 0) {
      if (category && sampleProducts[category]) {
        products = sampleProducts[category];
      } else if (!category) {
        // Return all sample products
        products = Object.values(sampleProducts).flat();
      } else {
        products = [];
      }
    }
    
    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try database first
    let product = await Product.findById(id);
    
    // If not found in database, check sample data
    if (!product) {
      const allSampleProducts = Object.values(sampleProducts).flat();
      product = allSampleProducts.find(p => p._id === id);
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;