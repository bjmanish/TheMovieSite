function PaginationControls({ page, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];
    const delta = 2; // how many pages around current

    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="mt-10 flex justify-center items-center gap-2 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-2 rounded-md font-medium transition
          ${
            page === 1
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
      >
        ←
      </button>

      {/* Page Numbers */}
      {getPages().map((p, index) =>
        p === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-3 py-2 text-white/60"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-4 py-2 rounded-md font-medium transition
              ${
                p === page
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-3 py-2 rounded-md font-medium transition
          ${
            page === totalPages
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
      >
        →
      </button>
    </nav>
  );
}

export default PaginationControls;
