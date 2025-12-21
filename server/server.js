import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routes (ESM)
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/user.js";
import watchlistRoutes from "./routes/watchlist.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Ensure JWT secret
if (!process.env.JWT_SECRET) {
  console.warn(
    "[WARN] JWT_SECRET is not set. Using a temporary development fallback."
  );
  process.env.JWT_SECRET = "dev_fallback_secret_change_me";
}

// =======================
// SECURITY & MIDDLEWARE
// =======================
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

app.use(morgan("combined"));
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// =======================
// HEALTH CHECK
// =======================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// =======================
// ROUTES
// =======================
console.log("Loaded auth route: ./routes/auth.js");

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/user", userRoutes);
app.use("/api/watchlist", watchlistRoutes);

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// START SERVER
// =======================
const startServer = async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, {
        dbName: process.env.MONGO_DB || "the_movie_site",
      });
      console.log("🗄️  Connected to MongoDB");
    } else {
      console.warn(
        "[WARN] MONGO_URI not set. Running without database."
      );
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📊 Health check: http://localhost:${PORT}/api/health`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default app;
