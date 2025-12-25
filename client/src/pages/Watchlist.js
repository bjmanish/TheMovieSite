import { useEffect, useState } from "react";
import { watchlistService } from "../services/watchlistService";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    watchlistService.getWatchlist().then((res) => {
      setMovies(res.data || []);
    });
  }, []);

  if (!movies.length) {
    return <p className="text-center">No movies in watchlist</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <div key={movie.movieId}>
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
            alt={movie.title}
          />
          <p className="mt-1 text-sm">{movie.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Watchlist;
