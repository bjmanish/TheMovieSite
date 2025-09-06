// services/userService.js
import { apiClient } from '../config/api';

export const addToWatchlist = async (movieId) => {
  const res = await apiClient.post('/user/watchlist', { movieId });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await apiClient.put('/user/profile', profileData);
  return res.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const res = await apiClient.post('/user/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const sendMobileVerification = async (mobileNumber) => {
  const res = await apiClient.post('/user/send-mobile-verification', { mobileNumber });
  return res.data;
};

export const verifyMobileNumber = async (verificationCode) => {
  const res = await apiClient.post('/user/verify-mobile', { verificationCode });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await apiClient.get('/user/me');
  return res.data;
};

// usage Example 
// import { addToWatchlist, updateProfile, uploadProfilePicture } from '../services/userService';

//<button onClick={() => addToWatchlist(movie.id)}>+ Watchlist</button>
