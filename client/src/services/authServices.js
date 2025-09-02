import { apiClient, SERVER_ENDPOINTS } from '../config/api';

export const login = async (email, password) => {
  const res = await apiClient.post(SERVER_ENDPOINTS.AUTH.LOGIN, { email, password });
  if (res.data.success && res.data.token) {
    localStorage.setItem('token', res.data.token);
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
    localStorage.setItem('token', res.data.token);
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
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
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
