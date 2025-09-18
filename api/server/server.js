const serverless = require('serverless-http');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// --- Database Connection ---
if (!process.env.MONGODB_URI) {
    // This will cause a controlled crash if the variable is missing
    throw new Error('FATAL ERROR: MONGODB_URI environment variable is not defined.');
}
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://hackcheck.netlify.app',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Mongoose Schema ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// --- Routes ---

// Test Route
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'The API is alive and routing correctly!' });
});

// Login Route
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
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, email: user.email, username: user.username },
        });

    } catch (error) {
        console.error("Login server error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// --- Export Handler ---
// This is the required wrapper for Netlify
module.exports.handler = serverless(app);