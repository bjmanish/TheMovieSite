import { apiClient } from "../config/api";

export const watchlistService = {
  addToWatchlist: async (movieData) => {
    const token = localStorage.getItem("token");

    const res = await apiClient.post(
      "/watchlist/add",
      movieData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  getWatchlist: async () => {
    const token = localStorage.getItem("token");

    const res = await apiClient.get("/watchlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },
};
