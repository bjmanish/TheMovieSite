import { useEffect, useState } from "react";
import WatchlistMovieCard from "../components/WatchlistMovieCard";
import { watchlistService } from "../services/watchlistService";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const res = await watchlistService.getWatchlist();
      setMovies(res.movies || []);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (movieId) => {
    setMovies((prev) =>
      prev.filter((m) => m.movieId !== movieId)
    );
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading watchlist...</p>;
  }

  if (!movies.length) {
    return (
      <p className="text-center text-white">
        Your watchlist is empty
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <WatchlistMovieCard
          key={movie.movieId}
          movie={movie}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default Watchlist;
