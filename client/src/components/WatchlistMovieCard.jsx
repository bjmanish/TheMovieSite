import { Link } from "react-router-dom";
import { watchlistService } from "../services/watchlistService";

const WatchlistMovieCard = ({ movie, onRemove }) => {
  const handleRemove = async () => {
    try {
      await watchlistService.removeFromWatchlist(movie.movieId);
      onRemove(movie.movieId); // update UI
     
    } catch (err) {
      alert("Failed to remove movie from watchlist");
    }
  };

  return (
    <div className="mt-2">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">

        {/* Poster */}
        <Link to={`/movie/${movie.movieId}`} className="group">
          <div className="relative aspect-[2/3] overflow-hidden">
            {movie.poster ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
          </div>
        </Link>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
            {movie.title || "Untitled"}
          </h3>

          {/* Actions */}
          <button
            onClick={handleRemove}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition"
          >
            Remove from Watchlist
          </button>
        </div>

        {/* Border hover */}
        <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/50 rounded-lg transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default WatchlistMovieCard;
