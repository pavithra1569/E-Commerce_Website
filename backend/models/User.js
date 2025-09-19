const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String }, // Optional for Google OAuth users
  googleId: { type: String }, // For Google OAuth
  avatar: { type: String }, // Profile picture URL
  provider: { type: String, default: 'local' }, // 'local' or 'google'
  resetToken: String,
  resetTokenExpiry: Date,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);