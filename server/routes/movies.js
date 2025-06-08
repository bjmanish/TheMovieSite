const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// 🔍 Search Movies
router.get('/search', verifyToken, async (req, res) => {
  const { query, page = 1 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("TMDB search error:", error.message);
    res.status(500).json({ error: "Failed to fetch movies from TMDB" });
  }
});

// 🔥 Get Popular Movies
router.get('/popular', verifyToken, async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: TMDB_API_KEY,
        page,
        language: 'en-US'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("TMDB popular error:", error.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

module.exports = router;
