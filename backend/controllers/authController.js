const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      name, 
      password: hashed,
      provider: 'local',
      isVerified: true // Auto-verify for now, can add email verification later
    });
    
    // Send welcome email
    await sendWelcomeEmail(email, name);
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    // Check if user signed up with Google
    if (user.provider === 'google' && !user.password) {
      return res.status(400).json({ error: 'Please use Google Sign-In for this account' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    let isNewUser = false;
    
    if (!user) {
      // Create new user
      user = await User.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        avatar: payload.picture,
        provider: 'google',
        isVerified: true
      });
      isNewUser = true;
      
      // Send welcome email for new users
      await sendWelcomeEmail(payload.email, payload.name);
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = payload.sub;
      user.avatar = payload.picture;
      user.provider = 'google';
      user.isVerified = true;
      await user.save();
    }
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token: jwtToken, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      },
      isNewUser
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ error: 'Google login failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    
    // Check if user signed up with Google
    if (user.provider === 'google' && !user.password) {
      return res.status(400).json({ error: 'This account uses Google Sign-In. Please use Google to log in.' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    
    const emailResult = await sendPasswordResetEmail(email, resetToken);
    
    if (emailResult.success) {
      res.json({ message: 'Password reset email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};