import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddToWatchlist from '../components/AddToWatchlist.jsx';
import { getMovieDetails } from '../services/movieService';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [health, setHealth] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);

  // Test connection to server
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL.replace(/\/$/, '') + '/health')
      .then(res => res.json())
      .then(data => setHealth(data.status || JSON.stringify(data)))
      .catch(() => setHealth('error'));
  }, []);

  useEffect(() => {
    getMovieDetails(id).then(res => {
      if (res.success) setMovie(res.data);
      else setMovie(null);
    });
  }, [id]);

  if (!movie) return <p className="text-center text-2xl font-bold animate-ping">Loading...</p>;

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer');

  // Helper function to truncate text to 100 words
  const truncateText = (text, wordLimit = 100) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const overviewText = movie.overview || '';
  const shouldTruncate = overviewText.split(' ').length > 100;
  const displayText = showFullOverview ? overviewText : truncateText(overviewText);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Server connection health check */}
      {/* <div className="mb-4 text-center">
        <span className={`px-3 py-1 rounded text-white ${String(health).toLowerCase() === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}>Server connection: {health || 'checking...'}</span>
      </div> */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster */}
        <div className="flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg mb-2 w-60"
          />
          <a
            href={`https://taazabull24.com/homelander/`}
            download target="_black"
            className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded transition-colors duration-200"
          >
            Download Link
          </a>

        <AddToWatchlist movieId={movie.id} isLoggedIn={true} token={localStorage.getItem('token')} />

        </div>
        {/* Movie Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title} ({movie.release_date?.slice(0, 4)})</h1>
          <p className="text-gray-500 mb-2">{movie.genres?.map(g => g.name).join(', ')}</p>
          <div className="mb-4">
            <p className="text-gray-300 leading-relaxed">{displayText}</p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullOverview(!showFullOverview)}
                className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm font-medium transition-colors"
              >
                {showFullOverview ? 'See Less' : 'See More'}
              </button>
            )}
          </div>
          <ul className="mb-4 space-y-1 text-sm text-gray-300">
            <li><strong>Release Date:</strong> {movie.release_date}</li>
            <li><strong>Runtime:</strong> {movie.runtime} min</li>
            <li><strong>Rating:</strong> {movie.vote_average} / 10 ({movie.vote_count} votes)</li>
            <li><strong>Language:</strong> {movie.original_language?.toUpperCase()}</li>
            <li><strong>Status:</strong> {movie.status}</li>
            <li><strong>Budget:</strong> ${movie.budget?.toLocaleString()}</li>
            <li><strong>Revenue:</strong> ${movie.revenue?.toLocaleString()}</li>
            <li><strong>Tagline:</strong> <em>{movie.tagline}</em></li>
          </ul>
          {trailer && (
            <div className="mb-0">
              <iframe
                width="100%"
                height="330"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg shadow"
              />
            </div>
          )}
        </div>
      </div>
      {/* Cast */}
      <h2 className="mt-8 font-bolder text-xl">Cast</h2>
      <ul className="flex-box gap-3 text-white overflow-x-auto pb-2">
        {movie.credits?.cast?.slice(0, 20).map(actor => (
          <li key={actor.cast_id} className="text-sm min-w-max">
            <span className="font-semibold">{actor.name}</span> as {actor.character}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetails;
