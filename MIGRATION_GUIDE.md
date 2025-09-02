# Migration Guide: From Monolithic to Client/Server Architecture

This document outlines the changes made to transform the project from a monolithic structure to a modular client/server architecture.

## 🔄 What Changed

### Before (Monolithic)
- Single React app with proxy to backend
- Mixed frontend and backend code
- Limited separation of concerns

### After (Modular)
- Separate client (React) and server (Express.js) modules
- Clear API boundaries
- Proper authentication flow
- Enhanced security and error handling

## 📁 New Project Structure

```
TheMovieSite/
├── client/                    # React frontend
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js        # NEW: Centralized API configuration
│   │   ├── services/
│   │   │   ├── authServices.js    # UPDATED: Uses new API config
│   │   │   ├── movieService.js    # NEW: Server API integration
│   │   │   └── tmdb.js            # LEGACY: Direct TMDB calls
│   │   └── ...
│   ├── package.json          # UPDATED: Removed proxy
│   └── .env                  # NEW: Client environment variables
├── server/                   # Express.js backend
│   ├── middleware/
│   │   ├── auth.js           # NEW: JWT authentication middleware
│   │   └── errorHandler.js   # NEW: Error handling middleware
│   ├── routes/
│   │   ├── auth.js           # NEW: Authentication routes
│   │   └── movies.js         # UPDATED: Enhanced movie routes
│   ├── server.js             # NEW: Main server file
│   ├── package.json          # NEW: Server dependencies
│   └── .env                  # UPDATED: Server environment variables
├── package.json              # NEW: Root package.json with workspaces
├── start-dev.bat             # NEW: Development startup script
└── README.md                 # UPDATED: Comprehensive documentation
```

## 🔧 Key Changes

### 1. API Configuration
**Before:** Direct TMDB API calls from client
```javascript
// Old: Direct TMDB calls
const response = await axios.get('https://api.themoviedb.org/3/movie/popular');
```

**After:** Server API with centralized configuration
```javascript
// New: Server API calls
import { getPopularMovies } from '../services/movieService';
const data = await getPopularMovies();
```

### 2. Authentication Flow
**Before:** Basic token storage
```javascript
// Old: Simple token storage
localStorage.setItem('token', res.data.token);
```

**After:** Enhanced authentication with interceptors
```javascript
// New: Automatic token handling
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Error Handling
**Before:** Basic error responses
```javascript
// Old: Simple error handling
res.status(500).json({ error: "Server error" });
```

**After:** Comprehensive error handling
```javascript
// New: Structured error responses
res.status(error.statusCode).json({
  success: false,
  error: error.message,
  ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
});
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install                    # Root dependencies
cd client && npm install      # Client dependencies
cd server && npm install      # Server dependencies
```

### 2. Configure Environment Variables

**Server (.env)**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TMDB_API_KEY=your-tmdb-api-key-here
CLIENT_URL=http://localhost:3000
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_TMDB_ACCESS_TOKEN=your-tmdb-access-token
```

### 3. Start Development Servers
```bash
# Start both servers
npm run dev

# Or start individually
npm run dev:client  # Port 3000
npm run dev:server  # Port 5000
```

## 🔄 Migration Steps

### For Existing Components

1. **Update API Calls**
   - Replace direct TMDB calls with server API calls
   - Use the new `movieService.js` functions
   - Update error handling to match new response format

2. **Update Authentication**
   - Use new `authServices.js` functions
   - Handle new response format with `success` field
   - Update token management

3. **Update Environment Variables**
   - Remove TMDB API key from client
   - Add server API URL to client
   - Configure JWT secret for server

### Example Component Update

**Before:**
```javascript
import { fetchPopularMovies } from '../services/tmdb';

const [movies, setMovies] = useState([]);

useEffect(() => {
  const loadMovies = async () => {
    try {
      const data = await fetchPopularMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  loadMovies();
}, []);
```

**After:**
```javascript
import { getPopularMovies } from '../services/movieService';

const [movies, setMovies] = useState([]);

useEffect(() => {
  const loadMovies = async () => {
    try {
      const response = await getPopularMovies();
      if (response.success) {
        setMovies(response.data.results);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  loadMovies();
}, []);
```

## 🛡️ Security Improvements

1. **JWT Authentication**: Proper token validation and refresh
2. **Rate Limiting**: API request throttling
3. **CORS Configuration**: Secure cross-origin requests
4. **Input Validation**: Request data validation
5. **Error Handling**: Secure error responses
6. **Helmet.js**: Security headers

## 📊 API Response Format

All server API responses now follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": [] // For validation errors
}
```

## 🔍 Testing

### Test Server Health
```bash
curl http://localhost:5000/api/health
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Movie API
```bash
# Get popular movies
curl http://localhost:5000/api/movies/popular

# Search movies
curl "http://localhost:5000/api/movies/search?query=batman"
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CLIENT_URL` is set correctly in server `.env`
2. **JWT Errors**: Check `JWT_SECRET` is set in server `.env`
3. **TMDB API Errors**: Verify `TMDB_API_KEY` is valid
4. **Port Conflicts**: Ensure ports 3000 and 5000 are available

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in server `.env`.

## 📈 Benefits of New Architecture

1. **Scalability**: Separate client and server can scale independently
2. **Security**: Centralized authentication and validation
3. **Maintainability**: Clear separation of concerns
4. **Performance**: Optimized API responses and caching
5. **Development**: Better development experience with hot reloading
6. **Deployment**: Independent deployment of client and server
