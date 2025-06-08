// services/userService.js
import axios from 'axios';
import { getToken } from './authService';

export const addToWatchlist = async (movieId) => {
  const res = await axios.post(
    'http://localhost:3000/api/user/watchlist',
    { movieId },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};


// usage Example 
// import { addToWatchlist } from '../services/userService';

//<button onClick={() => addToWatchlist(movie.id)}>+ Watchlist</button>
