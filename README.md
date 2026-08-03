# Maison Lumière — Perfume Shop

A luxury perfume e-commerce site built with React, Node.js/Express, and MongoDB.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017 (or set `MONGO_URI` in `server/.env`)

---

### 1. Install & seed the backend

```bash
cd server
npm install
npm run seed        # Seeds 6 perfume products into MongoDB
npm start           # Starts API server on http://localhost:5000
```

### 2. Install & run the frontend

Open a new terminal tab:

```bash
cd client
npm install
npm start           # Starts React dev server on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
perfume-shop/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Navbar, HeroBanner, ProductCard, Footer
│       └── pages/          # HomePage, ProductPage
└── server/                 # Express backend
    ├── models/Product.js   # Mongoose schema
    ├── routes/products.js  # REST API routes
    ├── data/seed.js        # Seed script
    └── index.js            # Entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?featured=true` | Featured products only |
| GET | `/api/products?category=Floral` | Filter by category |
| GET | `/api/products/:id` | Single product with full details |
| POST | `/api/products/:id/reviews` | Add a review |

## Features

- **Homepage**: Hero banner with particle animation, stats counter, featured products, CTA offer banner, filterable all-collections grid, atelier story section
- **Product Page**: Image gallery with lightbox, size selector with live price update, share buttons (Twitter, WhatsApp, Facebook, Pinterest), fragrance notes pyramid, rating breakdown, live review submission
- **Design**: Dark luxury palette (onyx + brass/gold), Cormorant Garamond serif display type, hover micro-interactions, responsive down to mobile
- **Data**: All content served from MongoDB — no hardcoded values in components
