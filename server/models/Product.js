// ─────────────────────────────────────────────────────────────────────────────
// server/models/Product.js  –  Mongoose model for a Perfume Product
//
// Defines the shape of every document stored in the "products" collection.
// Two schemas are used:
//   - reviewSchema  → embedded sub-document for individual user reviews
//   - productSchema → the main product document
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

// ── Review sub-schema ─────────────────────────────────────────────────────────
// Each product keeps an array of reviews embedded directly inside it.
// This avoids a separate collection and makes reads fast (one DB call gets
// both the product and all its reviews).
const reviewSchema = new mongoose.Schema({
  user:   { type: String, required: true },          // Display name of the reviewer
  avatar: { type: String, default: '' },             // Optional profile picture URL
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1–5)
  title:  { type: String, required: true },          // Short headline for the review
  body:   { type: String, required: true },          // Full review text
  date:   { type: Date, default: Date.now },         // Automatically set to "now" on creation
});

// ── Main Product schema ───────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  // Core identity
  name:            { type: String, required: true },
  brand:           { type: String, required: true },
  tagline:         { type: String },                 // Short poetic one-liner shown under the name

  // Descriptions — "description" is the short card snippet; "fullDescription" is
  // used on the individual product page for a richer narrative.
  description:     { type: String, required: true },
  fullDescription: { type: String },

  // Pricing — "originalPrice" is the crossed-out "was" price to show a discount
  price:           { type: Number, required: true },
  originalPrice:   { type: Number },                // for crossed-out "was" price

  // Classification tags used for filtering on the shop page
  category:        { type: String },                // e.g. "Floral", "Woody", "Oriental"
  gender:          { type: String },                // Unisex / Men / Women
  concentration:   { type: String },                // EDP / EDT / Parfum

  // Available sizes — each size has its own price and stock status
  sizes: [
    {
      ml:      Number,   // Bottle volume in millilitres
      price:   Number,   // Price for this specific size
      inStock: Boolean,  // Whether this size is currently available
    },
  ],

  // Images — the first entry is normally shown in galleries;
  // "thumbnailImage" is the dedicated card/hero preview image
  images:         [String],           // array of image URLs / gradients
  thumbnailImage: { type: String },   // hero card image

  // Scent pyramid — the three layers of a fragrance's composition
  notes: {
    top:   [String],  // First impressions (volatile, last 15–30 min)
    heart: [String],  // The core character of the scent (lasts a few hours)
    base:  [String],  // The lingering dry-down (can last all day)
  },

  // Aggregated review stats — recalculated every time a new review is posted
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // The embedded reviews array (uses reviewSchema above)
  reviews: [reviewSchema],

  // UI display helpers
  badge:     { type: String },              // "New", "Bestseller", "Limited"
  featured:  { type: Boolean, default: false }, // If true, shown in the Featured section on the homepage
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
