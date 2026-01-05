import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/movieService';
import { watchlistService } from "../services/watchlistService";

const HomePage = () => {
  const [page, setPage] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlistMovies, setWatchlist] = useState([]);
  // const [watchlist, setWatchlist] = useState([]);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  // console.log("Token:", token);

  const popularRef = useRef(null);

  const scrollLeft = () => {
    popularRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    popularRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {


    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popular, topRated, upcoming] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies()
        ]);

        if (popular.success) setPopularMovies(popular.data.results.slice(0, 6));
        if (topRated.success) setTopRatedMovies(topRated.data.results.slice(0, 6));
        if (upcoming.success) setUpcomingMovies(upcoming.data.results.slice(0, 6));
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchlist = async () => {
  try {
    const res = await watchlistService.getWatchlist();
    setWatchlist(res.movies || []);
  } catch (error) {
    console.error("Failed to fetch watchlist", error);
  }
};

    fetchMovies();
    fetchWatchlist();
  }, [isLoggedIn, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">⚠️</div>
        <h2 className="text-white text-2xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-white/60 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[70vh] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
        
        {popularMovies[0] && (
          <img
            src={`https://image.tmdb.org/t/p/original${popularMovies[0].backdrop_path}`}
            alt={popularMovies[0].title}
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Discover Amazing Movies
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Explore the latest releases, top-rated films, and upcoming blockbusters. 
                Your cinematic journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/search"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 text-center"
                >
                  Browse Movies
                </Link>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 text-center border border-white/20"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WatchList if user Logged In Section */}
      {isLoggedIn && (
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              WatchList Movies
            </h2>
      
            <Link
              to="/watchlist"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              View All →
            </Link>
          </div>
      
          {watchlistMovies.length === 0 ? (
            <p className="text-gray-400">
              Your watchlist is empty 🎬
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {watchlistMovies.map((movie) => (
                <MovieCard
                  key={movie._id || movie.id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </section>
      )}



      {/* Popular Movies Section */}
      <section className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
          <Link
            to="/search"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
            bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
        >
          ◀
        </button>

        {/* Movies Container */}
        <div
          ref={popularRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {popularMovies.map((movie) => (
            <div key={movie.id} className="min-w-[220px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
            bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
        >
          ▶
        </button>
      </section>
        {/* <PaginationControls  page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        /> */}

      {/* Top Rated Movies Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Top Rated</h2>
          <Link
            to="/search"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {topRatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Upcoming Movies Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
          <Link
            to="/search"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {upcomingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Explore More?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of movie enthusiasts and discover your next favorite film. 
          Create an account to save your favorites and get personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
          >
            Sign Up Free
          </Link>
          <Link
            to="/search"
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 border border-white/20"
          >
            Browse Movies
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
