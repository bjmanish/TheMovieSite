import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';

const  MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const trailer = movie.videos?.results.find(v => v.type === 'Trailer');

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster */}
        <div className="flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg mb-2 w-64"
          />
          <a
            href={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            download
            className="block mt-2 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded transition-colors duration-200"
          >
            Download Poster
          </a>
        </div>
        {/* Movie Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title} ({movie.release_date?.slice(0, 4)})</h1>
          <p className="text-gray-500 mb-2">{movie.genres?.map(g => g.name).join(', ')}</p>
          <p className="mb-4">{movie.overview}</p>
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
            <div className="mb-4">
              <iframe
                width="100%"
                height="315"
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
      <h2 className="mt-8 font-bold text-xl">Cast</h2>
      <ul className="flex gap-3 overflow-x-auto pb-2">
        {movie.credits?.cast?.slice(0, 10).map(actor => (
          <li key={actor.cast_id} className="text-sm min-w-max">
            <span className="font-semibold">{actor.name}</span> as {actor.character}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetails;
