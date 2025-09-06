import { apiClient, SERVER_ENDPOINTS } from '../config/api';

function isLocalStorageAvailable() {
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export const login = async (email, password) => {
  const res = await apiClient.post(SERVER_ENDPOINTS.AUTH.LOGIN, { email, password });
  if (res.data.success && res.data.token) {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  }
  throw new Error(res.data.error || 'Login failed');
};

export const register = async (username, email, password) => {
  const res = await apiClient.post(SERVER_ENDPOINTS.AUTH.REGISTER, { 
    username, 
    email, 
    password 
  });
  if (res.data.success && res.data.token) {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  }
  throw new Error(res.data.error || 'Registration failed');
};

export const getProfile = async () => {
  const res = await apiClient.get(SERVER_ENDPOINTS.AUTH.PROFILE);
  return res.data;
};

export const verifyToken = async () => {
  const res = await apiClient.get(SERVER_ENDPOINTS.AUTH.VERIFY);
  return res.data;
};

export const logout = () => {
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    localStorage.removeItem('token');
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = () => {
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    const token = localStorage.getItem('token');
    return !!token;
  }
  return false;
};

// // services/authService.js
// import axios from 'axios';

// const API = 'http://localhost:5000/api';

// export const signup = (email, password) =>
//   axios.post(`${API}/auth/signup`, { email, password });

// export const login = async (email, password) => {
//   const res = await axios.post(`${API}/auth/login`, { email, password });
//   localStorage.setItem('token', res.data.token);
// };

// export const getToken = () => localStorage.getItem('token');
