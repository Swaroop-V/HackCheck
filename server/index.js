require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path'); // Required for serving static files

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leakguard', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
});
const User = mongoose.model('User', UserSchema);
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});




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
    
    // Find the line that matches our suffix
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
      // If found, create the detailed messages
      message = `This password has been seen ${count.toLocaleString()} times in data breaches.`;
      subMessage = 'Please choose a more secure one.';
    }

    // Send the structured response
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = { passwordHash, otp, expiresAt: Date.now() + 10 * 60 * 1000 };
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
    const newUser = new User({ email: email, password: tempUser.passwordHash });
    await newUser.save();
    delete otpStore[email];
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user account.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful!' });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));