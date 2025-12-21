import { apiClient, SERVER_ENDPOINTS } from "../config/api";

export const watchlistService = {
  // Add movie to watchlist
  addToWatchlist: async ({ movieId, title, poster }) => {
    const res = await apiClient.post(
      SERVER_ENDPOINTS.WATCHLIST.ADD,
      { movieId, title, poster }
    );
    return res.data;
  },

  // Get user watchlist
  getWatchlist: async () => {
    const res = await apiClient.get(
      SERVER_ENDPOINTS.WATCHLIST.GET
    );
    return res.data;
  },

  // Remove from watchlist
  removeFromWatchlist: async (movieId) => {
    const res = await apiClient.delete(
      SERVER_ENDPOINTS.WATCHLIST.REMOVE(movieId)
    );
    return res.data;
  },

  // Check if movie exists in watchlist
  isInWatchlist: async (movieId) => {
    const res = await apiClient.get(
      SERVER_ENDPOINTS.WATCHLIST.CHECK(movieId)
    );
    return res.data;
  }
};
