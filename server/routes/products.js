// ─────────────────────────────────────────────────────────────────────────────
// server/routes/products.js  –  REST API routes for perfume products
//
// All routes here are mounted at /api/products in index.js.
// Endpoints:
//   GET  /              – list all products (with optional query filters)
//   POST /              – create a new product
//   GET  /:id           – fetch a single product by its MongoDB _id
//   POST /:id/reviews   – add a customer review to a product
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ── GET /api/products ─────────────────────────────────────────────────────────
// Returns all products. Supports optional query-string filters:
//   ?featured=true      → only homepage-featured items
//   ?category=Floral    → filter by scent family
//   ?gender=Women       → filter by target gender
router.get('/', async (req, res) => {
  try {
    // Build a dynamic filter object based on whatever query params are present
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.gender) filter.gender = req.query.gender;

    const products = await Product.find(filter);

    // Return both a count and the data array so the frontend can handle pagination later
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/products ────────────────────────────────────────────────────────
// Creates a brand-new perfume entry in the database.
// The body should contain at minimum: name, brand, description, price.
// Everything else has sensible defaults so the frontend form doesn't need to
// fill in every field.
router.post('/', async (req, res) => {
  try {
    const {
      name, brand, tagline, description, fullDescription,
      price, originalPrice, category, gender, concentration,
      sizes, images, thumbnailImage, notes, badge, featured
    } = req.body;

    // Validate the required fields before touching the DB
    if (!name || !brand || !description || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name, brand, description, and price are required'
      });
    }

    // Pick a sensible default image if none was provided
    const defaultImg = thumbnailImage || (images && images[0]) || '/images/bottle1.jpg';
    // Always store at least 2 image slots (main + gallery fallback)
    const productImages = (images && images.length) ? images : [defaultImg, defaultImg];

    const product = new Product({
      name,
      brand,
      tagline: tagline || '',
      description,
      // If no full description is given, reuse the short one so the product page
      // still has something to show
      fullDescription: fullDescription || description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category:      category      || 'Floral',
      gender:        gender        || 'Unisex',
      concentration: concentration || 'Eau de Parfum',
      // Default to a single 50ml size at the given price if no sizes array provided
      sizes: sizes || [{ ml: 50, price: Number(price), inStock: true }],
      images: productImages,
      thumbnailImage: defaultImg,
      notes: notes || { top: [], heart: [], base: [] },
      badge: badge || null,
      featured: Boolean(featured),
      // New products start with a perfect 5.0 rating (no reviews yet)
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────────────────────
// Returns a single product's complete document (including all reviews) by its
// MongoDB ObjectId. The product page uses this to render full details.
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/products/:id/reviews ────────────────────────────────────────────
// Lets a user submit a review for a specific product.
// After saving the review, we recalculate the product's aggregate rating
// so it's always up-to-date without a separate computation step on reads.
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, rating, title, body } = req.body;

    // Make sure all required review fields are present
    if (!user || !rating || !title || !body) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    // Reject ratings outside the 1–5 scale
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    // Prepend the new review so it appears at the top of the list (newest first)
    product.reviews.unshift({ user, rating: Number(rating), title, body, date: new Date() });

    // Recalculate aggregate rating by averaging all review scores
    // We use toFixed(1) so it stays a clean one-decimal number like 4.7
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((total / product.reviews.length).toFixed(1));
    product.reviewCount = product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
