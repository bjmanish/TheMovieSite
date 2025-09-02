import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TMDB_ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

// Server API endpoints
export const SERVER_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    VERIFY: `${API_BASE_URL}/auth/verify`
  },
  MOVIES: {
    POPULAR: `${API_BASE_URL}/movies/popular`,
    SEARCH: `${API_BASE_URL}/movies/search`,
    DETAILS: (id) => `${API_BASE_URL}/movies/${id}`,
    TOP_RATED: `${API_BASE_URL}/movies/top-rated`,
    UPCOMING: `${API_BASE_URL}/movies/upcoming`,
    GENRES: `${API_BASE_URL}/movies/genres`,
    BY_GENRE: (genreId) => `${API_BASE_URL}/movies/genre/${genreId}`
  }
};

// TMDB API configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  ACCESS_TOKEN: TMDB_ACCESS_TOKEN
};

// Axios instance for server API

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
