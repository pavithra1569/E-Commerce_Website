const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

Product.insertMany([
  { name: 'Laptop', price: 55000, image: 'https://your-image-url/laptop.jpeg' },
  { name: 'Smartphone', price: 25000, image: 'https://your-image-url/smartphone.jpeg' },
  { name: 'Headphones', price: 2500, image: 'https://your-image-url/headphone.jpeg' },
]).then(() => {
  console.log('Products seeded');
  mongoose.disconnect();
});