import React, { useEffect, useState } from 'react';
import MovieSlider from '../components/MovieSlider';
import { fetchNewReleases, fetchTopRatedMovies, fetchTrendingMovies } from '../services/tmdb';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    fetchTrendingMovies().then(setTrending);
    fetchTopRatedMovies().then(setTopRated);
    fetchNewReleases().then(setNewReleases);
  }, []);

  return (
    <div>
      <MovieSlider title="Trending" movies={trending} />
      <MovieSlider title="Top Rated" movies={topRated} />
      <MovieSlider title="New Releases" movies={newReleases} />
    </div>
  );
}
