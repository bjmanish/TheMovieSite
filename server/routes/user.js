// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

{/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}

router.post('/watchlist', auth, async (req, res) => {
  const { movieId } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.watchlist.includes(movieId)) {
    user.watchlist.push(movieId);
    await user.save();
  }
  res.json(user.watchlist);
});

module.exports = router;
