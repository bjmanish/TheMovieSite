// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import axios from 'axios';
// import { useEffect, useState } from 'react';

// const API_KEY = '2d468f680b00ee291f85357d557a5487';
// const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// export default function HomePage() {
//   const [trending, setTrending] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     axios
//       .get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
//       .then((res) => setTrending(res.data.results))
//       .catch((err) => console.error(err));
//   }, []);

//   const filteredMovies = trending.filter((movie) =>
//     movie.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-4">Trending Movies</h1>

//       <Input
//         type="text"
//         placeholder="Search movies..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="mb-6 w-full max-w-md"
//       />

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {filteredMovies.map((movie) => (
//           <Card key={movie.id} className="rounded-2xl shadow-lg overflow-hidden">
//             <img
//               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//               alt={movie.title}
//               className="w-full h-72 object-cover"
//             />
//             <CardContent className="p-2">
//               <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
//               <p className="text-sm text-gray-500">{movie.release_date}</p>
//               <Button className="mt-2 w-full">Details</Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


// Updated HomePage using TMDB API + JWT Auth Integration
import { useEffect, useState } from "react";
import MovieList from "../components/movieList";
import PaginationControls from "../components/paginationControls";

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
      const token = localStorage.getItem("token");
      const endpoint =
        searchQuery === "popular"
          ? `/api/popular?page=${pageNumber}`
          : `/api/search?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
