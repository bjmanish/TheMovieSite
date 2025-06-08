import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
});

export const fetchTrendingMovies = async () => {
  const res = await tmdb.get(`/trending/movie/week?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchTopRatedMovies = async () => {
  const res = await tmdb.get(`/movie/top_rated?api_key=${API_KEY}`);
  return res.data.results;
};

export const fetchNewReleases = async () => {
  const res = await tmdb.get(`/movie/now_playing?api_key=${API_KEY}`);
  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await tmdb.get(`/search/movie?query=${query}&api_key=${API_KEY}`);
  return res.data.results;
};

export const getMovieDetails = async (id) => {
  const res = await tmdb.get(`/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`);
  return res.data;
};

export const fetchMovieDetailsBatch = async (ids) => {
  const promises = ids.map(id => getMovieDetails(id));
  return Promise.all(promises);
};
