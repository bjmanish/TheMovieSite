
function DownloadButton({ identifier }) {
  const directLink = `https://archive.org/download/${identifier}/${identifier}.mp4`;

  return (
    <a className="btn btn-success btn-sm" href={directLink} download>
      Download MP4
    </a>
  );
}

export default DownloadButton;
