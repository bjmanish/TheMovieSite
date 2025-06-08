// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  watchlist: [Number], // TMDB movie IDs
  history: [Number],
});

module.exports = mongoose.model('user', userSchema);
