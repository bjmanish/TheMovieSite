# TMDB Movie Browser - Client/Server Architecture

A modern movie browsing application with JWT authentication, built with React (client) and Express.js (server) in a modular architecture.

## 🏗️ Architecture

This project is structured as a monorepo with separate client and server modules:

```
TheMovieSite/
├── client/          # React frontend application
├── server/          # Express.js backend API
├── package.json     # Root package.json with workspaces
└── README.md
```

## ✨ Features

### Client (React)
- Modern React with hooks and functional components
- Responsive design with Bootstrap and Tailwind CSS
- JWT authentication with localStorage
- Movie browsing and search functionality
- Pagination controls
- Movie details with trailers and cast information

### Server (Express.js)
- RESTful API with Express.js
- JWT authentication middleware
- TMDB API integration
- Rate limiting and security middleware
- Comprehensive error handling
- CORS configuration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or above)
- npm or yarn  
- TMDB API key (sign up at https://www.themoviedb.org/documentation/api)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd TheMovieSite
```

2. **Install dependencies for all modules**
```bash
npm run install:all
```

3. **Configure environment variables**

Create `.env` files in both client and server directories:

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

4. **Start development servers**
```bash
# Start both client and server concurrently
npm run dev

# Or start them separately:
npm run dev:client  # Starts React app on port 3000
npm run dev:server  # Starts Express server on port 5000
```

## 📁 Project Structure

### Client Structure
```
client/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── config/          # Configuration files
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── package.json         # Client dependencies
└── .env                 # Client environment variables
```

### Server Structure
```
server/
├── middleware/          # Express middleware
│   ├── auth.js         # JWT authentication
│   └── errorHandler.js # Error handling
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   └── movies.js       # Movie API routes
├── server.js           # Main server file
├── package.json        # Server dependencies
└── .env                # Server environment variables
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build both client and server
- `npm run install:all` - Install dependencies for all modules

### Client
- `npm run start` - Start React development server
- `npm run build` - Build for production
- `npm run test` - Run tests

### Server
- `npm run start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run test` - Run tests

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/verify` - Verify JWT token (protected)

### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/top-rated` - Get top rated movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/genres` - Get movie genres
- `GET /api/movies/genre/:genreId` - Get movies by genre

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register/login through the client
2. Server validates credentials and returns a JWT token
3. Client stores the token in localStorage
4. Token is automatically included in API requests
5. Server validates token on protected routes

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation with express-validator
- Comprehensive error handling

## 🚀 Deployment

### Client Deployment
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Server Deployment
```bash
cd server
npm run build
npm start
# Deploy to your server hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the repository.
