const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example: /api/search?query=classic&page=1&rows=10
router.get('/', async (req, res) => {
  const { query, page = 1, rows = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  try {
    const response = await axios.get('https://archive.org/advancedsearch.php', {
      params: {
        q: `${query} AND mediatype:movies`,
        fl: ['identifier', 'title', 'description'],
        rows,
        page,
        output: 'json',
      }
    });

    // Return the results
    res.json(response.data.response);
  } catch (error) {
    console.error('Error fetching from Internet Archive:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

module.exports = router;
