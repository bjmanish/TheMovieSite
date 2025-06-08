
function PaginationControls({ page, totalPages, onPageChange }) {
  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">
            Page {page} of {totalPages}
          </span>
        </li>
        <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default PaginationControls;
