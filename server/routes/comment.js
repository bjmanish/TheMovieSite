// routes/comments.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import Comment from '../models/comments.js';
import User from '../models/user.js';

const router = express.Router();

// Add a comment
router.post('/', auth, async (req, res) => {
  const { movieId, text } = req.body;
  const user = await User.findById(req.user.id);

  const comment = await Comment.create({
    movieId,
    userId: req.user.id,
    userEmail: user.email,
    text
  });

  res.status(201).json(comment);
});

// Get comments for a movie
router.get('/:movieId', async (req, res) => {
  const comments = await Comment.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
  res.json(comments);
});

export default router;
