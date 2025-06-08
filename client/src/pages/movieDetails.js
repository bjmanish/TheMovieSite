import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const trailer = movie.videos?.results.find(v => v.type === 'Trailer');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{movie.title} ({movie.release_date.slice(0, 4)})</h1>
      <p className="text-gray-500">{movie.genres.map(g => g.name).join(', ')}</p>
      <p className="my-4">{movie.overview}</p>

      {trailer && (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        />
      )}

      <h2 className="mt-6 font-bold text-xl">Cast</h2>
      <ul className="flex gap-3 overflow-x-auto">
        {movie.credits.cast.slice(0, 10).map(actor => (
          <li key={actor.cast_id} className="text-sm">
            {actor.name} as {actor.character}
          </li>
        ))}
      </ul>
    </div>
  );
}
