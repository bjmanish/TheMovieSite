import { useState } from "react";
import { apiClient } from '../config/api';

const AddToWatchlist = ({isLoggedIn, movieId }) => {

  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(true);

  const handleAddToWatchlist = async () => {
    if (!isLoggedIn) {
      alert('Please log in to add this movie to your watchlist');
      // return;
    }
    try {
      const res = await apiClient.post('/watchlist/add', { movieId });
      alert('Movie added to watchlist!');
    } catch (err) {
      console.error(err);
      alert('Failed to add movie to watchlist');
    }
  };

  return (
    <a
      // href="#"
      onClick={(e) => {
        e.preventDefault();
        if (!localStorage.getItem("token")) {
          alert("Please login first");
          return;
        }
        handleAddToWatchlist();
      }}
      className={`block mt-2 text-center px-4 py-2 rounded transition-colors duration-200
        ${
          added
            ? "bg-green-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
        text-white`}
      >
      {loading
        ? "Adding..."
        : added
        ? "Added ✓"
        : "Add To WatchList"}
    </a>
  );
};

export default AddToWatchlist;
