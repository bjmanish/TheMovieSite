import React from 'react';
import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">🎬</div>
      <h1 className="text-3xl font-bold text-white mb-4">Movie Details</h1>
      <p className="text-white/60 mb-6">
        Movie ID: {id}
      </p>
      <p className="text-white/40">
        Movie detail page coming soon...
      </p>
    </div>
  );
};

export default MovieDetailPage;
