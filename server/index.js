// ─────────────────────────────────────────────────────────────────────────────
// server/index.js  –  Entry point for the Express backend
//
// This file bootstraps the whole server:
//   1. Loads third-party middleware (CORS, JSON body parsing, static files)
//   2. Registers our API route groups
//   3. Connects to MongoDB, then starts listening only if the DB is ready
// ─────────────────────────────────────────────────────────────────────────────
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import our product-related routes (GET/POST for products, reviews, etc.)
const productRoutes = require('./routes/products');

const app = express();

// Use the PORT from environment (e.g. Heroku / Railway sets this),
// or fall back to 5000 for local development.
const PORT = process.env.PORT || 5000;

// Use the MONGO_URI from a .env file in production,
// or the local DB "perfumeshop" during development.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfumeshop';

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow requests from any origin (useful for local dev where React runs on :3000)
app.use(cors({ origin: '*', credentials: true }));

// Parse incoming JSON request bodies so we can access req.body
app.use(express.json());

// Serve the product images stored in the client's public/images folder
// so the frontend can load them as  /images/bottle1.jpg  etc.
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// ── Routes ────────────────────────────────────────────────────────────────────

// All product-related endpoints live under /api/products
app.use('/api/products', productRoutes);

// Simple health-check endpoint — handy for uptime monitors or debugging
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Database connection → Server start ───────────────────────────────────────
// We wait for MongoDB to connect before starting the HTTP server.
// If the connection fails we print the error and exit — no point running without a DB.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
