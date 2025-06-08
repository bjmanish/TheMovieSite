import MovieDetails from "./movieDetails";

function MovieList({ movies }) {
  if (!movies || movies.length === 0) return <p>No movies found.</p>;

  return (
    <div className="list-group">
      {movies.map((movie) => (
        <MovieDetails key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieList;
