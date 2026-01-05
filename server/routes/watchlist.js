import express from "express";
import { auth } from "../middleware/auth.js";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

// ADD TO WATCHLIST
router.post("/add", auth, async (req, res) => {
  try {
    
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { movieId, title, poster } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId is required",
      });
    }

    let watchlist = await Watchlist.findOne({
      user: req.user.id,
    });

    // Create watchlist if not exists
    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user.id,
        movies: [],
      });
    }

    // Prevent duplicate movie
    const exists = watchlist.movies.some(
      (m) => m.movieId === movieId
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Movie already in watchlist",
      });
    }

    watchlist.movies.push({ movieId, title, poster });
    await watchlist.save();

    res.status(201).json({
      success: true,
      message: "Movie added to watchlist",
      movies: watchlist.movies,
    });
  } catch (error) {
    console.error("Add Watchlist Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET USER WATCHLIST
router.get("/", auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      movies: watchlist ? watchlist.movies : [],
    });
  } catch (error) {
    console.error("Fetch Watchlist Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
    });
  }
});


export default router;
