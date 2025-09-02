import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/movieService';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchMovies(query, 1);
    }
  }, [searchParams]);

  const fetchMovies = async (query, page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await searchMovies(query, page);
      if (response.success) {
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch movies');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMovies(searchQuery, page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Search Movies</h1>
        <p className="text-white/60 mb-8">Find your favorite movies and discover new ones</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-semibold mb-2">Search Error</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button 
            onClick={() => fetchMovies(searchQuery, currentPage)} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && movies.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-white/60">
              Found {movies.length} movies
            </p>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <span className="text-white/60 px-4">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && movies.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-white text-2xl font-semibold mb-2">No movies found</h2>
          <p className="text-white/60 mb-6">
            We couldn't find any movies matching "{searchQuery}". Try a different search term.
          </p>
          <div className="space-y-2 text-white/40">
            <p>Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['action', 'comedy', 'drama', 'horror', 'sci-fi'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSearchQuery(genre)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors duration-200"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!loading && !error && movies.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <div className="text-purple-400 text-6xl mb-4">🎬</div>
          <h2 className="text-white text-2xl font-semibold mb-2">Start Your Search</h2>
          <p className="text-white/60 mb-6">
            Enter a movie title, genre, or keyword to find amazing films
          </p>
          <div className="space-y-2 text-white/40">
            <p>Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Avengers', 'Batman', 'Star Wars', 'Harry Potter', 'Marvel'].map((title) => (
                <button
                  key={title}
                  onClick={() => setSearchQuery(title)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors duration-200"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
