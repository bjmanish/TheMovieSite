import { apiClient, SERVER_ENDPOINTS } from "../config/api";

export const watchlistService = {
  addToWatchlist: async ({ movieId, title, poster }) => {
    const res = await apiClient.post(
      SERVER_ENDPOINTS.WATCHLIST.ADD,
      { movieId, title, poster }
    );
    return res.data;
  },

  getWatchlist: async () => {
    const res = await apiClient.get("/watchlist");
    return res.data;
  },

  removeFromWatchlist : async (movieId) => {
    const res = await apiClient.delete(
      SERVER_ENDPOINTS.WATCHLIST.REMOVE,
      { data: { movieId } }
    );
    return res.data;
  } 
};
