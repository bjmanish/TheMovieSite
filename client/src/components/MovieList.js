import React from "react";
import MovieDetails from "./MovieDetails";

function MovieList({ movies }) {
  if (movies.length === 0) return null;

  return (
    <div className="list-group">
      {movies.map((movie) => (
        <MovieDetails key={movie.identifier} movie={movie} />
      ))}
    </div>
  );
}

export default MovieList;
