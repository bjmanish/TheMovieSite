// pages/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieSlider from '../components/MovieSlider';
import { searchMovies } from '../services/tmdb';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) {
      searchMovies(query).then(setResults);
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for: {query}</h2>
      <MovieSlider title="Results" movies={results} />
    </div>
  );
}
