import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';

// Components
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
// import MovieDetails from './pages/movieDetails';
import MovieDetails from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import Watchlist from './pages/Watchlist.jsx';
// Services
import { getProfile, isAuthenticated } from './services/authServices';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        if (authenticated) {
          // Fetch user profile here
          const profileRes = await getProfile();
          if (profileRes.success && profileRes.user) {
            setUser({ isAuthenticated: true, ...profileRes.user });
          } else {
            setUser({ isAuthenticated: true });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navbar user={user} setUser={setUser} />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} />} />
            <Route 
              path="/profile" 
              element={
                user?.isAuthenticated ? (
                  <>
                  <ProfilePage user={user} setUser={setUser} />
                  <Watchlist id={user.id} />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
