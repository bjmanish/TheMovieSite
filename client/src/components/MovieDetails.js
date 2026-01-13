import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/tmdb";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieDetails(id);
      setMovie(data);
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <LoadingSpinner />;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="text-white">

      {/* ================= HERO (POSTER + BASIC INFO) ================= */}
      <section className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-[55vh] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold">
            {movie.title}
            <span className="text-gray-400 ml-2">
              ({movie.release_date?.slice(0, 4)})
            </span>
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            ⭐ {movie.vote_average?.toFixed(1)} • {movie.runtime} min
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
        </div>
      </section>

      {/* ================= MOVIE DETAILS ================= */}
      <section className="px-4 py-6 space-y-4">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          {movie.overview}
        </p>
      </section>

      {/* ================= TRAILER (YOUTUBE STYLE) ================= */}
      {trailer && (
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-3">Trailer</h2>
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* ================= CAST ================= */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Top Cast</h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {movie.credits?.cast?.slice(0, 10).map((actor) => (
            <div
              key={actor.cast_id}
              className="min-w-[120px] bg-gray-800 rounded-lg p-2 text-center"
            >
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-36 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-36 bg-gray-700 rounded-md mb-2 flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
              <p className="text-sm font-medium">{actor.name}</p>
              <p className="text-xs text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DESKTOP ENHANCEMENTS ================= */}
      <style jsx>{`
        @media (min-width: 768px) {
          section {
            max-width: 1100px;
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
}
