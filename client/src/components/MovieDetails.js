import DownloadBtn from "./DownloadBtn";

function MovieDetails({ movie }) {
  const link = `https://archive.org/details/${movie.identifier}`;

  return (
    <div className="list-group-item">
      <h5>{movie.title}</h5>
      <p>{movie.description?.substring(0, 150) || "No description available."}</p>
      <div className="d-flex justify-content-between">
        <a href={link} className="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener noreferrer">
          View on Archive.org
        </a>
        <DownloadBtn identifier={movie.identifier} />
      </div>
    </div>
  );
}

export default MovieDetails;
