import { useState } from "react";
import { watchlistService } from "../services/watchlistService";

const AddToWatchlist = ({ movie }) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
console.log("MOVIE PROP:", movie);

  const handleAddToWatchlist = async () => {
    const movieId =
  movie?.id || movie?._id || movie?.movie?.id;

if (!movieId) {
  console.error("Invalid movie object:", movie);
  alert("Movie data not available yet");
  return;
}

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await watchlistService.addToWatchlist({
        movieId: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
      });

      if (res.success) {
        setAdded(true);
        alert("Movie added to watchlist!");
      } else {
        alert(res.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToWatchlist}
      disabled={loading || added}
      className="w-full mt-2 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
    >
      {loading ? "Adding..." : added ? "Added ✓" : "Add to Watchlist"}
    </button>
  );
};

export default AddToWatchlist;
