const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String, // Add this field
});

module.exports = mongoose.model('Product', productSchema);