import { useState } from 'react';
import { searchMovies } from '../services/tmdb';

const SearchPage = () => {
  const [query, setQuery] = useState('Jack Reacher');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const data = await searchMovies(query);
      setResults(data);
    } catch (err) {
      console.error('Error searching movies:', err);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((movie) => (
          <div key={movie.id} className="bg-gray-800 text-white p-2 rounded shadow">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="rounded mb-2"
            />
            <h3 className="text-sm font-semibold">{movie.title}</h3>
            <p className="text-xs">{movie.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
