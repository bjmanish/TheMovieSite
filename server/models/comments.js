// models/comments.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  movieId: Number,
  userId: String,
  userEmail: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
