// Updated HomePage using TMDB API
import { useEffect, useState } from "react";
import MovieList from "./MovieList";
import PaginationControls from "./PaginationControls";

function HomePage() {
  const [query, setQuery] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (searchQuery = query, pageNumber = page) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const endpoint =
        searchQuery === "popular"
          ? `/api/popular?page=${pageNumber}`
          : `/api/search?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies("popular", 1); // Trigger default fetch on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query) fetchMovies(query, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchMovies(query, 1);
  };

  return (
    <>
      <h1 className="text-center mb-4">Movie Browser (TMDB)</h1>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <MovieList movies={movies} />
      {totalPages > 1 && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}

export default HomePage;
