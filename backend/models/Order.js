const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  price: { type: Number }, // unit price at purchase time
  name: { type: String }, // snapshot for display
  image: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'cod', 'upi'], default: 'card' },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed', 'cod_pending'], default: 'pending' },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);