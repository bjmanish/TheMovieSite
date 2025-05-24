const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Middleware to check if API key is available
router.use((req, res, next) => {
  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: "TMDB API key is not configured." });
  }
  next();
});

// Search movies endpoint: /api/search?query=classic&page=1
router.get('/search', async (req, res) => {
  const { query, page = 1 } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: "Missing or empty 'query' parameter" });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        include_adult: false,
      },
    });

    res.json(response.data); // includes results array, total_pages, total_results
  } catch (error) {
    console.error('Error fetching from TMDB (search):', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data.status_message || 'TMDB API error' });
    }
    res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
  }
});

// Popular movies endpoint: /api/popular?page=1
router.get('/popular', async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: TMDB_API_KEY,
        page,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from TMDB (popular):', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data.status_message || 'TMDB API error' });
    }
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

module.exports = router;
