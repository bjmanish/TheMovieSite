// components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies..." />
      <button type="submit">Search</button>
    </form>
  );
}
