import express from "express";
import { auth } from "../middleware/auth.js";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

/* ============================
   ADD TO WATCHLIST
============================ */
router.post("/add", auth, async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId is required",
      });
    }
 console.log("AUTH USER:", req.user);
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    console.log("AUTH USER:", req.user);

    if (!watchlist) {

      watchlist = await Watchlist.create({
        user: req.user.id,
        movies: [],
      });
    }

    const exists = watchlist.movies.some(
      (movie) => movie.movieId === movieId
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
      data: watchlist.movies,
    });
  } catch (error) {
    console.error("Add Watchlist Error:", error);
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ============================
   GET WATCHLIST
============================ */
router.get("/", auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: watchlist ? watchlist.movies : [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ============================
   REMOVE FROM WATCHLIST
============================ */
router.delete("/remove/:movieId", auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.id });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: "Watchlist not found",
      });
    }

    watchlist.movies = watchlist.movies.filter(
      (movie) => movie.movieId !== req.params.movieId
    );

    await watchlist.save();

    res.status(200).json({
      success: true,
      message: "Movie removed from watchlist",
      data: watchlist.movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
