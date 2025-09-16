require('dotenv').config();

// 1. Use CommonJS 'require' syntax for all imports
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');


const app = express();

app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Mongoose Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const otpStore = {};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

// Auth Middleware
const protect = async (req, res, next) => {
  await dbConnect(); // Ensure DB is connected
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

app.post('/api/check-password', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ leaked: false, message: 'Password is required' });
  }
  try {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    let found = false;
    let count = 0;

    // Split the text response into lines
    const lines = data.split('\n');
    
    // Find the line that matches the suffix
    const matchingLine = lines.find(line => {
      const [hashSuffix] = line.split(':');
      return hashSuffix.trim().toUpperCase() === suffix;
    });

    if (matchingLine) {
      found = true;
      // If a match is found, parse the count
      count = parseInt(matchingLine.split(':')[1], 10);
    }
    
    // Create the dynamic message
    let message = 'This password is safe and was not found in any known breaches.';
    let subMessage = 'Good job!'; // Default sub-message for safe passwords

    if (found) {
      // If found, creates the detailed messages
      message = `This password has been seen ${count.toLocaleString()} times in data breaches.`;
      subMessage = 'Please choose a more secure one.';
    }

    // Sends the structured response
    res.json({
      leaked: found,
      count: count,
      message: message,
      subMessage: subMessage, // Add the new subMessage to the response
    });
  }
    catch (err) {
    res.status(500).json({ leaked: false, message: `Server Error: ${err.message}` });
  }
});

app.post('/api/signup/initiate', async (req, res) => {
  const { username, email, password } = req.body; 
  if (!username || !email || !password) { 
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  // Check if username OR email already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'A user with that email or username already exists.' });
  }

  delete otpStore[email];

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = {
    username, 
    plainPassword: password,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };


  const mailOptions = {
    from: `"HackCheck Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your HackCheck Verification Code',
    html: `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;"><h2 style="color: #16a34a;">HackCheck Verification</h2><p>Thank you for signing up. Please use the following code to verify your email address:</p><div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 15px; background-color: #f2f2f2; border-radius: 8px; display: inline-block;">${otp}</div><p>This code will expire in 10 minutes.</p></div>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email address.' });
  } catch (error) {
    console.error("FULL NODEMAILER ERROR:", error);
    res.status(500).json({ message: 'Failed to send OTP email.' });
  }
});

app.post('/api/signup/verify', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }
  const tempUser = otpStore[email];
  if (!tempUser) {
    return res.status(400).json({ message: 'Invalid request or OTP expired. Please try signing up again.' });
  }
  if (Date.now() > tempUser.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP has expired. Please try again.' });
  }
  if (tempUser.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP.' });
  }
    try {
    // Hashing the password explicitly here
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempUser.plainPassword, salt);

    const newUser = new User({
      username: tempUser.username,
      email: email,
      password: passwordHash,
    });
    await newUser.save();
    
    delete otpStore[email];
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user account.' });
  }
});



//   UPDATED LOGIN ENDPOINT
// ===================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login attempt failed: No user found for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt failed: Password incorrect for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
        });
        
        res.status(200).json({
          message: 'Login successful!',
          user: { id: user.id, email: user.email, username: user.username },
        });
      }
    );

  } catch (error) {
    console.error("Login server error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ===================================
//   DASHBOARD ENDPOINT (PROTECTED)
// ===================================
app.get('/api/dashboard', protect, async (req, res) => {
  
  res.json({
    message: `Welcome, ${req.user.username}!`,
    
    activity: [
      { id: 1, action: 'Checked password "password123"', date: new Date() },
      { id: 2, action: 'Viewed Security Tips', date: new Date() },
    ]
  });
});

// ===================================
//   PASSWORD RESET - PHASE 1: REQUEST
// ===================================
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, not going to reveal if the email exists.
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // 1. Generates a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hashes the token before saving it to the database
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Sets an expiry time (like 10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 4. Creates the reset URL and sends the email (containing the un-hashed token)
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"HackCheck Support" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'HackCheck Password Reset Request',
      html: `
        <p>You requested a password reset. Please click the link below to reset your password.</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ===================================
//   PASSWORD RESET - PHASE 2: RESET (CORRECTED)
// ===================================
app.post('/api/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    // THIS IS THE MISSING LINE THAT FIXES THE BUG
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    // Hash the new password explicitly
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt); // Corrected to use the password from req.body

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// ===================================
//   USER PROFILE - CHANGE PASSWORD
// ===================================
app.post('/api/user/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both the current and new password.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // Hashes the new password explicitly
    user.password = newPassword; // Set plain password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ===================================
//   LOGOUT ENDPOINT
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { 
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
});



//  "catch-all" handler: for any request that doesn't match an API route above,
// sends back React's index.html file

module.exports = app;