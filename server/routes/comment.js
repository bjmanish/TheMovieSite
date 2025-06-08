// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const auth = require('../middleware/auth');
const User = require('../models/user');

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

module.exports = router;
