import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movies: [
      {
        movieId: { type: String, required: true },
        title: String,
        poster: String,
      },
    ],
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("watchlist", watchlistSchema);

export default Watchlist;