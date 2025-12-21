const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one watchlist per user
    },
    movies: [
      {
        movieId: {
          type: String, // TMDB ID or your movie _id
          required: true,
        },
        title: String,
        poster: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);
