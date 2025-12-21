const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/user');


const router = express.Router();

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const COOKIE_NAME = 'refresh_token';

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

// Register user
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });

    const accessToken = signAccessToken({ userId: user._id, username: user.username });
    const refreshToken = signRefreshToken({ userId: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: !!(process.env.NODE_ENV === 'production'),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: accessToken,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ userId: user._id, username: user.username });
    const refreshToken = signRefreshToken({ userId: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: !!(process.env.NODE_ENV === 'production'),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('_id username email createdAt');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt } });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME] || req.body?.refreshToken;
    if (!token) return res.status(401).json({ success: false, error: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const accessToken = signAccessToken({ userId: user._id, username: user.username });
    res.json({ success: true, token: accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
      } catch (_) {}
    }
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: !!(process.env.NODE_ENV === 'production') });
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.json({ success: true, message: 'Logged out' });
  }
});

module.exports = router;
