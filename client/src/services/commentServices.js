import axios from 'axios';
import { getToken } from './authService';

const API = 'http://localhost:5000/api/comments';

export const fetchComments = async (movieId) => {
  const res = await axios.get(`${API}/${movieId}`);
  return res.data;
};

export const postComment = async (movieId, text) => {
  const res = await axios.post(API, { movieId, text }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};
