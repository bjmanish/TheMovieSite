// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  watchlist: { type: [Number], default: [] }, // TMDB movie IDs
  history: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
