const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
  });
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - ShopSphere',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ShopSphere</h1>
          <p style="color: white; margin: 10px 0 0 0;">E-Gadgets Store</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your ShopSphere account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 ShopSphere. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email for new users
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ShopSphere!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to ShopSphere!</h1>
          <p style="color: white; margin: 10px 0 0 0;">Your E-Gadgets Destination</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining ShopSphere! We're excited to have you as part of our community.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Explore our wide range of premium e-gadgets including:
          </p>
          
          <ul style="color: #666; line-height: 1.8;">
            <li>Latest Laptops & Computers</li>
            <li>Smartphones & Tablets</li>
            <li>Gaming Accessories</li>
            <li>Audio & Headphones</li>
            <li>Smartwatches & Wearables</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Happy shopping!<br>
            The ShopSphere Team
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateResetToken,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
