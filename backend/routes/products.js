const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Expanded sample products data for demonstration and fallback
const sampleProducts = {
  Laptops: [
    { _id: '1', name: 'MacBook Pro 14-inch', price: '₹1,99,900', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', description: 'Powerful laptop for professionals' },
    { _id: '2', name: 'Dell XPS 13', price: '₹1,25,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop', description: 'Ultra-portable laptop' },
    { _id: '3', name: 'HP Spectre x360', price: '₹1,15,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', description: 'Convertible laptop with touch screen' },
    { _id: '23', name: 'ASUS ROG Zephyrus G14', price: '₹1,49,990', category: 'Laptops', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400&h=400&fit=crop', description: 'Compact gaming laptop with Ryzen and RTX' },
    { _id: '24', name: 'Lenovo ThinkPad X1 Carbon', price: '₹1,35,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop', description: 'Business laptop with premium build' },
    { _id: '25', name: 'Acer Swift 3', price: '₹68,990', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', description: 'Lightweight laptop for everyday use' }
  ],
  Smartphones: [
    { _id: '4', name: 'iPhone 15 Pro', price: '₹1,34,900', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', description: 'Latest iPhone with Pro features' },
    { _id: '5', name: 'Samsung Galaxy S24', price: '₹89,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Flagship Android smartphone' },
    { _id: '6', name: 'Google Pixel 8', price: '₹75,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', description: 'Pure Android experience' },
    { _id: '26', name: 'OnePlus 12', price: '₹64,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', description: 'Fast and smooth performance' },
    { _id: '27', name: 'Xiaomi 14', price: '₹59,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35f8?w=400&h=400&fit=crop', description: 'Value flagship with great camera' },
    { _id: '28', name: 'Nothing Phone (2)', price: '₹44,999', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop', description: 'Unique design with Glyph interface' }
  ],
  Headphones: [
    { _id: '7', name: 'Sony WH-1000XM5', price: '₹29,990', category: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', description: 'Premium noise-cancelling headphones' },
    { _id: '8', name: 'Bose QuietComfort', price: '₹26,900', category: 'Headphones', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', description: 'Comfortable over-ear headphones' },
    { _id: '9', name: 'AirPods Pro', price: '₹24,900', category: 'Headphones', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', description: 'Wireless earbuds with ANC' },
    { _id: '29', name: 'Sennheiser Momentum 4', price: '₹34,990', category: 'Headphones', image: 'https://images.unsplash.com/photo-1518448204086-9b0b3f9444ff?w=400&h=400&fit=crop', description: 'Audiophile-grade sound with ANC' },
    { _id: '30', name: 'JBL Tune 760NC', price: '₹7,999', category: 'Headphones', image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop', description: 'Affordable noise-cancelling headphones' },
    { _id: '31', name: 'Beats Studio3', price: '₹19,999', category: 'Headphones', image: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=400&h=400&fit=crop', description: 'Dynamic sound with iconic design' }
  ],
  Gaming: [
    { _id: '10', name: 'PlayStation 5', price: '₹54,990', category: 'Gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', description: 'Next-gen gaming console' },
    { _id: '11', name: 'Xbox Series X', price: '₹52,990', category: 'Gaming', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop', description: 'Powerful gaming console' },
    { _id: '12', name: 'Gaming Keyboard', price: '₹8,999', category: 'Gaming', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', description: 'Mechanical gaming keyboard' },
    { _id: '32', name: 'Nintendo Switch OLED', price: '₹31,999', category: 'Gaming', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop', description: 'Hybrid console with vibrant OLED display' },
    { _id: '33', name: 'Logitech G502 Hero Mouse', price: '₹4,999', category: 'Gaming', image: 'https://images.unsplash.com/photo-1555617107-08fda9a50e38?w=400&h=400&fit=crop', description: 'High-precision gaming mouse' },
    { _id: '34', name: 'Secretlab Gaming Chair', price: '₹24,999', category: 'Gaming', image: 'https://images.unsplash.com/photo-1611224885990-3c7b7b2615e4?w=400&h=400&fit=crop', description: 'Ergonomic chair for long sessions' }
  ],
  Smartwatches: [
    { _id: '13', name: 'Apple Watch Series 9', price: '₹45,900', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop', description: 'Advanced smartwatch' },
    { _id: '14', name: 'Samsung Galaxy Watch', price: '₹28,999', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', description: 'Feature-rich smartwatch' },
    { _id: '35', name: 'Garmin Forerunner 265', price: '₹44,990', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=400&fit=crop', description: 'GPS smartwatch for runners' },
    { _id: '36', name: 'Fitbit Versa 4', price: '₹19,999', category: 'Smartwatches', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop', description: 'Health and fitness smartwatch' }
  ],
  Tablets: [
    { _id: '15', name: 'iPad Pro', price: '₹81,900', category: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', description: 'Professional tablet' },
    { _id: '16', name: 'Samsung Galaxy Tab S9', price: '₹72,999', category: 'Tablets', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', description: 'Android tablet' },
    { _id: '37', name: 'iPad Air', price: '₹54,900', category: 'Tablets', image: 'https://images.unsplash.com/photo-1553530666-ef9e046e7b29?w=400&h=400&fit=crop', description: 'Lightweight and powerful' },
    { _id: '38', name: 'Lenovo Tab P11 Pro', price: '₹36,999', category: 'Tablets', image: 'https://images.unsplash.com/photo-1589739901584-cb0f95f6a689?w=400&h=400&fit=crop', description: 'OLED display entertainment tablet' }
  ],
  Cameras: [
    { _id: '17', name: 'Canon EOS R5', price: '₹3,39,995', category: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', description: 'Professional mirrorless camera' },
    { _id: '18', name: 'Sony Alpha A7 IV', price: '₹2,48,990', category: 'Cameras', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop', description: 'Full-frame mirrorless camera' },
    { _id: '39', name: 'Nikon Z6 II', price: '₹1,79,999', category: 'Cameras', image: 'https://images.unsplash.com/photo-1495707902647-5f08f39b81b2?w=400&h=400&fit=crop', description: 'Versatile full-frame mirrorless' },
    { _id: '40', name: 'Fujifilm X-T5', price: '₹1,49,999', category: 'Cameras', image: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2fb?w=400&h=400&fit=crop', description: 'APS-C mirrorless with great colors' }
  ],
  Audio: [
    { _id: '19', name: 'JBL Charge 5', price: '₹15,999', category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', description: 'Portable Bluetooth speaker' },
    { _id: '20', name: 'Marshall Acton II', price: '₹24,999', category: 'Audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop', description: 'Vintage-style speaker' },
    { _id: '41', name: 'Sony SRS-XB33', price: '₹11,990', category: 'Audio', image: 'https://images.unsplash.com/photo-1596305926969-4641c47a7578?w=400&h=400&fit=crop', description: 'Extra bass portable speaker' },
    { _id: '42', name: 'Bose SoundLink Flex', price: '₹15,500', category: 'Audio', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop', description: 'Compact Bluetooth speaker' }
  ],
  Accessories: [
    { _id: '21', name: 'Anker Power Bank', price: '₹2,999', category: 'Accessories', image: 'https://images.unsplash.com/photo-1609592806787-3d9c4d4a7b0f?w=400&h=400&fit=crop', description: 'High-capacity power bank' },
    { _id: '22', name: 'Logitech MX Master 3', price: '₹8,495', category: 'Accessories', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', description: 'Wireless productivity mouse' },
    { _id: '43', name: 'SanDisk 1TB Portable SSD', price: '₹9,999', category: 'Accessories', image: 'https://images.unsplash.com/photo-1563208174-82eda57f78bf?w=400&h=400&fit=crop', description: 'High speed external SSD' },
    { _id: '44', name: 'Apple AirTag (4 Pack)', price: '₹9,900', category: 'Accessories', image: 'https://images.unsplash.com/photo-1617955689412-4b1808d528d2?w=400&h=400&fit=crop', description: 'Item trackers for Apple devices' }
  ]
};

// Get products with optional category and search query
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;

    // Database filter
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };

    let products = await Product.find(filter);

    // Fallback to sample data if DB empty or not seeded for this query
    if (!products || products.length === 0) {
      let pool = [];
      if (category) {
        pool = sampleProducts[category] || [];
      } else {
        pool = Object.values(sampleProducts).flat();
      }

      if (q) {
        const needle = q.toLowerCase();
        products = pool.filter(p =>
          (p.name && p.name.toLowerCase().includes(needle)) ||
          (p.description && p.description.toLowerCase().includes(needle)) ||
          (p.category && p.category.toLowerCase().includes(needle))
        );
      } else {
        products = pool;
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
