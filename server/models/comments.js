// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movieId: Number,
  userId: String,
  userEmail: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema);
