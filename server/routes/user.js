// routes/user.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import twilio from 'twilio';
import { fileURLToPath } from 'url';
import { auth } from '../middleware/auth.js';
import User from '../models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile-pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Initialize Twilio client (only if credentials are provided)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

router.post('/watchlist', auth, async (req, res) => {
  const { movieId } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.watchlist.includes(movieId)) {
    user.watchlist.push(movieId);
    await user.save();
  }
  res.json(user.watchlist);
});

// Update user profile
router.put('/profile', auth, [
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        mobileNumber: user.mobileNumber
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Upload profile picture
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user profile picture path
    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Send mobile verification code
router.post('/send-mobile-verification', auth, [
  body('mobileNumber').isMobilePhone().withMessage('Please provide a valid mobile number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { mobileNumber } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if mobile number is already verified by another user
    const existingUser = await User.findOne({
      'mobileNumber.number': mobileNumber,
      'mobileNumber.verified': true,
      _id: { $ne: user._id }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Mobile number already verified by another user' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with verification code
    user.mobileNumber = {
      number: mobileNumber,
      verified: false,
      verificationCode: verificationCode,
      verificationExpiry: verificationExpiry
    };
    await user.save();

    // Send SMS using Twilio (in production)
    if (process.env.NODE_ENV === 'production' && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mobileNumber
        });
      } catch (twilioError) {
        console.error('Twilio error:', twilioError);
        // Continue even if SMS fails - code is still saved for verification
      }
    } else {
      // In development, log the code to console
      console.log(`Development mode - Verification code for ${mobileNumber}: ${verificationCode}`);
    }

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Verify mobile number
router.post('/verify-mobile', auth, [
  body('verificationCode').isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { verificationCode } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.mobileNumber || !user.mobileNumber.verificationCode) {
      return res.status(400).json({ success: false, error: 'No verification code found. Please request a new one.' });
    }

    if (user.mobileNumber.verificationCode !== verificationCode) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }

    if (new Date() > user.mobileNumber.verificationExpiry) {
      return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
    }

    // Mark mobile number as verified
    user.mobileNumber.verified = true;
    user.mobileNumber.verificationCode = null;
    user.mobileNumber.verificationExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'Mobile number verified successfully',
      mobileNumber: user.mobileNumber
    });
  } catch (error) {
    console.error('Verify mobile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
