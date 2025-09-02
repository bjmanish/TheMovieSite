import { apiClient, SERVER_ENDPOINTS } from '../config/api';

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  const res = await apiClient.get(`${SERVER_ENDPOINTS.MOVIES.POPULAR}?page=${page}`);
  return res.data;
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  const res = await apiClient.get(`${SERVER_ENDPOINTS.MOVIES.SEARCH}?query=${encodeURIComponent(query)}&page=${page}`);
  return res.data;
};

// Get movie details
export const getMovieDetails = async (id) => {
  const res = await apiClient.get(SERVER_ENDPOINTS.MOVIES.DETAILS(id));
  return res.data;
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  const res = await apiClient.get(`${SERVER_ENDPOINTS.MOVIES.TOP_RATED}?page=${page}`);
  return res.data;
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  const res = await apiClient.get(`${SERVER_ENDPOINTS.MOVIES.UPCOMING}?page=${page}`);
  return res.data;
};

// Get movie genres
export const getMovieGenres = async () => {
  const res = await apiClient.get(SERVER_ENDPOINTS.MOVIES.GENRES);
  return res.data;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  const res = await apiClient.get(`${SERVER_ENDPOINTS.MOVIES.BY_GENRE(genreId)}?page=${page}`);
  return res.data;
};

// Get trending movies (using popular as fallback)
export const getTrendingMovies = async (page = 1) => {
  return getPopularMovies(page);
};

// Get new releases (using upcoming as fallback)
export const getNewReleases = async (page = 1) => {
  return getUpcomingMovies(page);
};
