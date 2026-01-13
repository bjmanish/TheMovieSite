import { Link } from 'react-router-dom';

export default function MovieSlider({ title, movies }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex overflow-x-scroll gap-4 p-2">
        {movies.map(movie => (
          <div key={movie.id} className="w-40 flex-shrink-0">
            {/* <img
              className="rounded"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            /> */}
            <Link to={`/movie/${movie.id}`}>
                <img src={process.env.REACT_APP_IMAGE_URL+movie.poster_path} alt={movie.title} />
            </Link>
            <p className="text-sm mt-2">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
