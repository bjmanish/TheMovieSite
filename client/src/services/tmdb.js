import axios from 'axios';

// const ACCESS_TOKEN = import.meta.env.TMDB_ACCESS_TOKEN; // for Vite
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN; // for CRA (Create React App)

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});


export const fetchTrendingMovies = async () => {
  const res = await tmdb.get('/trending/movie/week');
  return res.data.results;
};

export const fetchTopRatedMovies = async () => {
  const res = await tmdb.get('/movie/top_rated');
  return res.data.results;
};

export const fetchNewReleases = async () => {
  const res = await tmdb.get('/movie/now_playing');
  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await tmdb.get(`/search/movie?query=${encodeURIComponent(query)}`);
  if (res.data.results.length === 0) console.log("not found movies");
  return res.data.results;
};

export const getMovieDetails = async (id) => {
  const res = await tmdb.get(`/movie/${id}?append_to_response=videos,credits`);
  return res.data;
};

export const fetchMovieDetailsBatch = async (ids) => {
  const promises = ids.map(id => getMovieDetails(id));
  return Promise.all(promises);
};
