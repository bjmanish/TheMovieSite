const TMDB_API_KEY = process.env.REACT_APP_API_KEY; // Using working API key from FilmFusion
const TMDB_BASE_URL = process.env.REACT_APP_TMDB_API_URL;
const TMDB_IMAGE_PATH = process.env.REACT_APP_TMDB_IMAGE_BASE_URL;

// console.log("TMDB_API_KEY:", TMDB_API_KEY);
// console.log("TMDB_API_URL:", TMDB_BASE_URL);
// console.log("TMDB_IMAGE_PATH:", TMDB_IMAGE_PATH);

// Helper function to make TMDB API calls
const tmdbApiCall = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });
  
  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
  // console.log('Making TMDB API call to:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      // console.error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('TMDB API call failed:', error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = async () => {
  try {
    const data = await tmdbApiCall('/movie/popular', {language: 'en-US' });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  try {
    const data = await tmdbApiCall('/search/movie', { 
      query, 
      page, 
      // language: 'en-US', 
      include_adult: false 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get movie details
export const getMovieDetails = async (id) => {
  try {
    const data = await tmdbApiCall(`/movie/${id}`, { 
      // language: 'en-US', 
      append_to_response: 'credits,videos,images' 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const data = await tmdbApiCall('/movie/top_rated', { page, language: 'en-US' });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  try {
    const data = await tmdbApiCall('/movie/upcoming', { page});
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get movie genres
export const getMovieGenres = async () => {
  try {
    const data = await tmdbApiCall('/genre/movie/list', { language: 'en-US' });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const data = await tmdbApiCall('/discover/movie', { 
      with_genres: genreId, 
      page, 
      language: 'en-US', 
      sort_by: 'popularity.desc' 
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get trending movies
export const getTrendingMovies = async (page = 1) => {
  try {
    const data = await tmdbApiCall('/trending/all/day', { page, language: 'en-US' });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get new releases (using upcoming as fallback)
export const getNewReleases = async (page = 1) => {
  return getUpcomingMovies(page);
};

// Export TMDB image path for components
export { TMDB_IMAGE_PATH };
