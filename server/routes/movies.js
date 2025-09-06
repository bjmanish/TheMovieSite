const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Try alternative TMDB endpoints if the main one fails
const TMDB_ENDPOINTS = [
  'https://api.themoviedb.org/3',
  'https://api.themoviedb.org/3',
  'https://api.themoviedb.org/3'
];

let currentEndpointIndex = 0;
const TMDB_BASE_URL = TMDB_ENDPOINTS[currentEndpointIndex];
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_V4_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_BEARER_TOKEN;

// Helper: build axios config supporting either v3 api_key or v4 bearer token
const buildAxiosConfig = (params = {}) => {
  const config = { 
    params: { ...params },
    timeout: 10000, // 10 second timeout
    headers: {
      'User-Agent': 'TheMovieSite/1.0'
    }
  };
  if (TMDB_API_KEY) {
    config.params.api_key = TMDB_API_KEY;
  }
  if (!TMDB_API_KEY && TMDB_V4_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${TMDB_V4_ACCESS_TOKEN}`;
  }
  return config;
};

// Helper: request with fallback from v3 to v4 token if available
const requestWithFallback = async (url, params) => {
  let lastError;
  
  for (let i = 0; i < TMDB_ENDPOINTS.length; i++) {
    try {
      const currentUrl = url.replace(TMDB_BASE_URL, TMDB_ENDPOINTS[i]);
      const config = buildAxiosConfig(params);
      
      console.log(`Attempting TMDB request to: ${currentUrl}`);
      const response = await axios.get(currentUrl, config);
      console.log(`TMDB request successful to: ${currentUrl}`);
      return response;
    } catch (err) {
      lastError = err;
      console.error(`TMDB request failed to endpoint ${i}:`, err.message);
      
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        console.log(`Timeout/connection error, trying next endpoint...`);
        continue;
      }
      
      const status = err.response?.status;
      const shouldRetryWithV4 = TMDB_API_KEY && TMDB_V4_ACCESS_TOKEN && (status === 401 || status === 403);
      if (shouldRetryWithV4) {
        try {
          const config = { 
            params: { ...params }, 
            headers: { 
              Authorization: `Bearer ${TMDB_V4_ACCESS_TOKEN}`,
              'User-Agent': 'TheMovieSite/1.0'
            },
            timeout: 10000
          };
          return await axios.get(url, config);
        } catch (v4Error) {
          console.error('V4 token retry also failed:', v4Error.message);
          lastError = v4Error;
        }
      }
    }
    // throw err;
  }
  
  throw lastError;
};

// Middleware to check if TMDB API key is configured
const checkTMDBConfig = (req, res, next) => {
  if (!TMDB_API_KEY && !TMDB_V4_ACCESS_TOKEN) {
    return res.status(500).json({
      success: false,
      error: 'TMDB credentials not configured. Set TMDB_API_KEY (v3) or TMDB_ACCESS_TOKEN (v4).'
    });
  }
  
  // Log the configuration for debugging
  console.log('TMDB Config Check:', {
    hasApiKey: !!TMDB_API_KEY,
    hasAccessToken: !!TMDB_V4_ACCESS_TOKEN,
    baseUrl: TMDB_BASE_URL
  });
  
  next();
};

// Get popular movies
router.get('/popular', checkTMDBConfig, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/movie/popular`,
      { page, language: 'en-US' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular movies'
    });
  }
});

// Search movies
router.get('/search', checkTMDBConfig, async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false,
        error: 'Search query is required'
      });
    }

    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/search/movie`,
      { query, page, language: 'en-US', include_adult: false }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const details = error.response?.data || error.message;
    console.error('Error searching movies:', status, details);
    res.status([401,403,404].includes(status) ? status : 500).json({
      success: false,
      error: typeof details === 'string' ? details : (details?.status_message || 'Failed to search movies')
    });
  }
});

// Get movie details
router.get('/:id', checkTMDBConfig, async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/movie/${id}`,
      { language: 'en-US', append_to_response: 'credits,videos,images' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movie details'
    });
  }
});

// Get top rated movies
router.get('/top-rated', checkTMDBConfig, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/movie/top_rated`,
      { page, language: 'en-US' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching top rated movies:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top rated movies'
    });
  }
});

// Get upcoming movies
router.get('/upcoming', checkTMDBConfig, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/movie/upcoming`,
      { page, language: 'en-US' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming movies'
    });
  }
});

// Test TMDB connectivity
router.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing TMDB connectivity...');
    
    // Test with a simple endpoint
    const testUrl = 'https://api.themoviedb.org/3/configuration';
    const config = buildAxiosConfig();
    
    console.log('Attempting connection to:', testUrl);
    const response = await axios.get(testUrl, config);
    
    res.json({
      success: true,
      message: 'TMDB connection successful',
      data: {
        images: response.data.images,
        change_keys: response.data.change_keys
      }
    });
  } catch (error) {
    console.error('TMDB connection test failed:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    res.status(500).json({
      success: false,
      error: 'TMDB connection test failed',
      details: {
        message: error.message,
        code: error.code,
        status: error.response?.status
      }
    });
  }
});

// Get movie genres
router.get('/genres', checkTMDBConfig, async (req, res) => {
  try {
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/genre/movie/list`,
      { language: 'en-US' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching genres:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genres'
    });
  }
});

// Get movies by genre
router.get('/genre/:genreId', checkTMDBConfig, async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    
    const response = await requestWithFallback(
      `${TMDB_BASE_URL}/discover/movie`,
      { with_genres: genreId, page, language: 'en-US', sort_by: 'popularity.desc' }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching movies by genre:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movies by genre'
    });
  }
});

module.exports = router;
