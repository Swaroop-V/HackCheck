// api/server/server.js

require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

const app = express();

// --- DATABASE CONNECTION HELPER FOR SERVERLESS ---
// This pattern prevents connection errors on "warm" function invocations
let conn = null;
const dbConnect = async () => {
  if (conn == null) {
    console.log('Creating new MongoDB connection...');
    conn = mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    }).then(() => mongoose);
    
    // `await` the connection to ensure it's established before proceeding
    await conn;
    console.log('MongoDB connected.');
  } else {
    console.log('Reusing existing MongoDB connection.');
  }
  return conn;
};
// ------------------------------------

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Mongoose Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});
// This pattern prevents Mongoose from redefining the model on warm reloads
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const otpStore = {};

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

// Auth Middleware
const protect = async (req, res, next) => {
  await dbConnect(); // Ensure DB is connected before checking user
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');
    if (!req.user) {
        return res.status(401).json({ message: 'User not found.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ================== API ROUTER ==================
// We use an Express Router to handle all API endpoints
const router = express.Router();

router.post('/check-password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ leaked: false, message: 'Password is required' });
  try {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);
    const apiRes = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await apiRes.text();
    let count = 0;
    const matchingLine = data.split('\n').find(line => line.split(':')[0].trim().toUpperCase() === suffix);
    if (matchingLine) { count = parseInt(matchingLine.split(':')[1], 10); }
    const found = !!matchingLine;
    const message = found ? `This password has been seen ${count.toLocaleString()} times in data breaches.` : 'This password is safe and was not found in any known breaches.';
    const subMessage = found ? 'Please choose a more secure one.' : 'Good job!';
    res.json({ leaked: found, count, message, subMessage });
  } catch (err) { res.status(500).json({ leaked: false, message: `Server Error: ${err.message}` }); }
});

router.post('/signup/initiate', async (req, res) => {
  await dbConnect();
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Username, email, and password are required.' });
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) return res.status(400).json({ message: 'A user with that email or username already exists.' });
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = { username, plainPassword: password, otp, expiresAt: Date.now() + 600000 };
  const mailOptions = { from: `"HackCheck Support" <${process.env.GMAIL_USER}>`, to: email, subject: 'Your HackCheck Verification Code', html: `<div style="...">${otp}</div>` };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email address.' });
  } catch (error) { res.status(500).json({ message: 'Failed to send OTP email.' }); }
});

router.post('/signup/verify', async (req, res) => {
  await dbConnect();
  const { email, otp } = req.body;
  const tempUser = otpStore[email];
  if (!tempUser || tempUser.otp !== otp || Date.now() > tempUser.expiresAt) return res.status(400).json({ message: 'Invalid or expired OTP.' });
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempUser.plainPassword, salt);
    const newUser = new User({ username: tempUser.username, email, password: passwordHash });
    await newUser.save();
    delete otpStore[email];
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) { res.status(500).json({ message: 'Error creating user account.' }); }
});

router.post('/login', async (req, res) => {
  await dbConnect();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
    res.status(200).json({ message: 'Login successful!', user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) { res.status(500).json({ message: 'Server error during login.' }); }
});

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, activity: [{ id: 1, action: 'Checked password "password123"', date: new Date() }] });
});

router.post('/forgot-password', async (req, res) => {
  await dbConnect();
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If an account exists, an email has been sent.' });
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 600000;
  await user.save();
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const mailOptions = { from: `"HackCheck Support" <${process.env.GMAIL_USER}>`, to: user.email, subject: 'HackCheck Password Reset', html: `<p>Click here to reset: <a href="${resetURL}">${resetURL}</a></p>` };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'If an account exists, an email has been sent.' });
  } catch (error) { res.status(500).json({ message: 'Error sending email.' }); }
});

router.post('/reset-password/:token', async (req, res) => {
  await dbConnect();
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Token is invalid or has expired.' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({ message: 'Password has been successfully reset.' });
});

router.post('/user/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'All fields are required.' });
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect current password.' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.status(200).json({ message: 'Password updated successfully.' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
  res.status(200).json({ message: 'Logged out successfully.' });
});

// This is the Netlify standard for mounting an Express app as a serverless function
app.use('/.netlify/functions/api', router);

// Export the handler for Netlify
module.exports.handler = serverless(app);