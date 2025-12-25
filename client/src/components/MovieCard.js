import { Link } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
const MovieCard = ({ movie }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
    <div className="mt-2">
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className={`text-sm font-semibold ${getRatingColor(movie.vote_average)}`}>
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <div className="text-white text-sm font-medium mb-2">
                {formatDate(movie.release_date)}
              </div>
              <div className="flex items-center space-x-2 text-white/80 text-xs">
                <span>{movie.vote_count?.toLocaleString() || 0} votes</span>
                <span>•</span>
                <span>{movie.adult ? '18+' : 'All Ages'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 group-hover:text-purple-300 transition-colors duration-200 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
            {movie.overview || 'No description available'}
          </p>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/50 rounded-lg transition-all duration-300 pointer-events-none"></div>
      </div>
    </Link>
    
      <AddToWatchlist movie={movie} isLoggedIn={true} />
    </div>

    </>
  );
};

export default MovieCard;
