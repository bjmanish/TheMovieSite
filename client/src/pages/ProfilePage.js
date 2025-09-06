import React, { useEffect, useState } from 'react';
import { sendMobileVerification, updateProfile, uploadProfilePicture, verifyMobileNumber } from '../services/userService';

const ProfilePage = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
      setMobileNumber(user.mobileNumber?.number || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setUser(response.user);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setMessage('');

    try {
      const response = await uploadProfilePicture(file);
      if (response.success) {
        setUser(prev => ({ ...prev, profilePicture: response.profilePicture }));
        setMessage('Profile picture updated successfully!');
      } else {
        setError(response.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!mobileNumber) {
      setError('Please enter a mobile number');
      return;
    }

    setError('');
    setMessage('');

    try {
      const response = await sendMobileVerification(mobileNumber);
      if (response.success) {
        setMessage('Verification code sent! Check your phone or console (development mode)');
        setIsVerifyingMobile(true);
      } else {
        setError(response.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code');
    }
  };

  const handleVerifyMobile = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setMessage('');

    try {
      const response = await verifyMobileNumber(verificationCode);
      if (response.success) {
        setUser(prev => ({ ...prev, mobileNumber: response.mobileNumber }));
        setMessage('Mobile number verified successfully!');
        setIsVerifyingMobile(false);
        setVerificationCode('');
      } else {
        setError(response.error || 'Failed to verify mobile number');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify mobile number');
    }
  };

  if (!user) return <div className="text-center py-12 text-white">No user data available.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mt-8 text-white">
      <div className="flex flex-col items-center mb-6">
        {/* Profile Picture */}
        <div className="relative mb-4">
          <img
            src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : '/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-400"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiM4QjVDRkYiLz4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyNCIgeT0iMjQiPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE4IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgNDBDMTIgMzIuMjY4IDMTOC4yNjggMjYgMjYgMjZIMjJDMzMuNjQ1IDI2IDQzIDM1LjM1NSA0MyA0N1Y0MEgxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K';
            }}
          />
          <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? '⏳' : '📷'}
          </label>
        </div>

        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-white/60">Welcome, <span className="font-semibold">{user.username}</span>!</p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="space-y-4">
        {!isEditing ? (
          <div className="space-y-2 text-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Mobile:</span>
              <div className="flex items-center gap-2">
                <span>{user.mobileNumber?.number || 'Not provided'}</span>
                {user.mobileNumber?.verified && (
                  <span className="text-green-400 text-sm">✓ Verified</span>
                )}
              </div>
            </div>
            {user.createdAt && (
              <div className="flex justify-between items-center">
                <span className="font-semibold">Joined:</span>
                <span>{new Date(user.createdAt).toLocaleString()}</span>
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Mobile Number Verification */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-semibold mb-3">Mobile Number Verification</h3>
          
          {!user.mobileNumber?.verified ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    disabled={isVerifyingMobile}
                  />
                  <button
                    onClick={handleSendVerification}
                    disabled={isVerifyingMobile || !mobileNumber}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Send Code
                  </button>
                </div>
              </div>

              {isVerifyingMobile && (
                <div>
                  <label className="block text-sm font-medium mb-2">Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={handleVerifyMobile}
                      disabled={!verificationCode}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-400">
              <span>✓</span>
              <span>Mobile number verified: {user.mobileNumber.number}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
