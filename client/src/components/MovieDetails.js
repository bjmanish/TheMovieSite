import DownloadBtn from "./DownloadBtn";

function MovieDetails({ movie }) {
  const posterBase = "https://image.tmdb.org/t/p/w300";
  const poster = movie.poster_path ? posterBase + movie.poster_path : "https://via.placeholder.com/300x450?text=No+Image";
  const movieLink = `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <div className="list-group-item">
      <div className="d-flex">
        <img
          src={poster}
          alt={movie.title}
          style={{
            width: "300px",
            height: "auto",
            marginRight: "15px",
            objectFit: "cover",
            borderRadius: "8px"
          }}
        />
        <div className="flex-grow-1">
          <h5>{movie.title}</h5>
          <p>{movie.overview?.substring(0, 150) || "No description available."}</p>
          <div className="d-flex justify-content-between align-items-center">
            <a
              href={movieLink}
              className="btn btn-outline-secondary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on TMDB
            </a>
            <DownloadBtn identifier={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
