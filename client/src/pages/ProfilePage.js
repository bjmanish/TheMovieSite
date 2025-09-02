import React from 'react';

const ProfilePage = ({ user }) => {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">👤</div>
      <h1 className="text-3xl font-bold text-white mb-4">User Profile</h1>
      <p className="text-white/60 mb-6">
        Welcome to your profile page!
      </p>
      <p className="text-white/40">
        Profile features coming soon...
      </p>
    </div>
  );
};

export default ProfilePage;
