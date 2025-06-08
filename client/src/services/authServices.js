import axios from 'axios';

export const login = async (email, password) => {
  const res = await axios.post('/api/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
};

export const signup = async (email, password) => {
  await axios.post('/api/auth/signup', { email, password });
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
