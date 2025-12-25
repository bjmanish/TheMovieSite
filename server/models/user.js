// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  watchlist: { type: [Number], default: [] }, // TMDB movie IDs
  history: { type: [Number], default: [] },
  profilePicture: { type: String, default: null },
  mobileNumber: { 
    number: { type: String, default: null },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationExpiry: { type: Date, default: null }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
