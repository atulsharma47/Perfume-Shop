// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/AddProductModal.js  –  Admin "Add New Perfume" form
//
// A modal form that lets an admin user add a new perfume product directly
// from the frontend, without needing access to a separate admin dashboard.
// On submit, it POSTs to the backend API which saves it to MongoDB.
//
// After a successful save, the parent component receives the new product via
// the `onProductAdded` callback, then reloads the page so it appears in the grid.
//
// Props:
//   isOpen        – boolean, controls visibility
//   onClose       – callback to close the modal
//   onProductAdded – callback called with the new product data after a successful save
//
// Fields:
//   Required: Name, Price, Short Description
//   Optional: Brand, Tagline, Category, Gender, Concentration,
//             Image, Full Description, Top/Heart/Base Notes, Badge, Featured flag
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import axios from 'axios';
import './AddProductModal.css';

// API base URL — reads from .env in production, falls back to localhost for dev
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {

  // ── Form state ──────────────────────────────────────────────────────────────
  // All form fields are controlled — each input is tied to a key in formData.
  // Sensible defaults pre-fill most fields so the admin just needs to enter
  // the name, price, and a description.
  const [formData, setFormData] = useState({
    name:             '',
    brand:            'Maison Lumière', // default to own brand
    tagline:          '',
    description:      '',               // short card snippet (required)
    fullDescription:  '',               // longer product page text (optional)
    price:            '',               // required — in INR
    originalPrice:    '',               // optional crossed-out "was" price
    category:         'Floral',
    gender:           'Unisex',
    concentration:    'Eau de Parfum',
    thumbnailImage:   '/images/bottle1.jpg',
    badge:            '',               // e.g. "New", "Bestseller", "Limited"
    featured:         true,             // show on homepage by default
    topNotes:         '',               // comma-separated string, converted to array on submit
    heartNotes:       '',
    baseNotes:        '',
  });

  const [loading, setLoading] = useState(false); // true while the API call is in flight
  const [error,   setError]   = useState('');    // validation or server error message
  const [success, setSuccess] = useState(false); // true briefly after a successful save

  // Don't render anything if the modal is closed (saves DOM nodes)
  if (!isOpen) return null;

  // ── handleChange ────────────────────────────────────────────────────────────
  // Generic change handler for all inputs — handles text, number, select, and checkbox.
  // Uses computed property names so every field can share this single handler.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ── handleSubmit ────────────────────────────────────────────────────────────
  // Validates the form, builds the API payload, and POSTs to the backend.
  // Sizes are auto-generated at 30ml / 50ml / 100ml based on the base price.
  // Notes are split from comma-separated strings into arrays.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation before making a network request
    if (!formData.name || !formData.price || !formData.description) {
      setError('Name, price, and short description are required.');
      return;
    }

    setLoading(true);
    setError('');

    // Build the full payload that matches what the server expects
    const payload = {
      name:            formData.name,
      brand:           formData.brand,
      tagline:         formData.tagline,
      description:     formData.description,
      // Fall back to the short description if no full description was provided
      fullDescription: formData.fullDescription || formData.description,
      price:           Number(formData.price),
      originalPrice:   formData.originalPrice ? Number(formData.originalPrice) : null,
      category:        formData.category,
      gender:          formData.gender,
      concentration:   formData.concentration,
      thumbnailImage:  formData.thumbnailImage,
      // Include 2 extra images alongside the chosen thumbnail for the gallery
      images: [formData.thumbnailImage, '/images/bottle2.jpg', '/images/bottle3.jpg'],
      badge:    formData.badge || null,
      featured: formData.featured,
      // Auto-generate three common sizes based on the entered base price
      sizes: [
        { ml: 30,  price: Math.round(Number(formData.price) * 0.7), inStock: true }, // 30ml at 70%
        { ml: 50,  price: Number(formData.price),                    inStock: true }, // 50ml = base price
        { ml: 100, price: Math.round(Number(formData.price) * 1.5), inStock: true }, // 100ml at 150%
      ],
      notes: {
        // Split comma-separated note strings into arrays; fall back to generic defaults
        top:   formData.topNotes   ? formData.topNotes.split(',').map((s)   => s.trim()) : ['Bergamot', 'Citrus'],
        heart: formData.heartNotes ? formData.heartNotes.split(',').map((s) => s.trim()) : ['Rose', 'Jasmine'],
        base:  formData.baseNotes  ? formData.baseNotes.split(',').map((s)  => s.trim()) : ['Musk', 'Amber'],
      },
    };

    try {
      const res = await axios.post(`${API}/products`, payload);
      setSuccess(true);
      // Notify the parent (Navbar/HomePage) that a new product was created
      if (onProductAdded) onProductAdded(res.data.data);
      // Auto-close the modal 1.5 seconds after success so the user sees the confirmation
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      // Show the server's error message if it sent one, otherwise a generic fallback
      setError(err.response?.data?.error || 'Failed to create product.');
    } finally {
      // Always stop the loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    /* Backdrop — clicking outside closes the modal */
    <div className="add-modal-backdrop" onClick={onClose}>
      {/* Modal panel — stop clicks from bubbling to the backdrop */}
      <div className="add-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header: title + close button */}
        <div className="add-modal-header">
          <h3>Add New Perfume</h3>
          <button className="add-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Alert banners — only one will show at a time */}
        {error   && <div className="add-modal-alert add-modal-alert--error">{error}</div>}
        {success && <div className="add-modal-alert add-modal-alert--success">✓ Perfume added successfully!</div>}

        <form onSubmit={handleSubmit} className="add-modal-form">

          {/* ── Row 1: Name + Brand ─────────────────────────────────────────── */}
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Velvet Oud" required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
          </div>

          {/* ── Row 2: Price + Original Price ───────────────────────────────── */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (INR) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="4200" required />
            </div>
            <div className="form-group">
              <label>Original Price (INR)</label>
              {/* Leave blank if there's no discount */}
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="5500" />
            </div>
          </div>

          {/* ── Row 3: Category + Gender + Concentration ─────────────────────── */}
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Oriental">Oriental</option>
                <option value="Floral">Floral</option>
                <option value="Woody">Woody</option>
                <option value="Aquatic">Aquatic</option>
                <option value="Fresh">Fresh</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div className="form-group">
              <label>Concentration</label>
              <select name="concentration" value={formData.concentration} onChange={handleChange}>
                <option value="Eau de Parfum">Eau de Parfum</option>
                <option value="Extrait de Parfum">Extrait de Parfum</option>
                <option value="Eau de Toilette">Eau de Toilette</option>
              </select>
            </div>
          </div>

          {/* ── Image picker ─────────────────────────────────────────────────── */}
          {/* Lets the admin pick one of the pre-uploaded bottle images */}
          <div className="form-group">
            <label>Image selection</label>
            <select name="thumbnailImage" value={formData.thumbnailImage} onChange={handleChange}>
              <option value="/images/bottle1.jpg">Bottle 1 (Obsidian Gold)</option>
              <option value="/images/bottle2.jpg">Bottle 2 (Crystal Dew)</option>
              <option value="/images/bottle3.jpg">Bottle 3 (Forest Amber)</option>
              <option value="/images/bottle4.jpg">Bottle 4 (Golden Honey)</option>
              <option value="/images/bottle5.jpg">Bottle 5 (Ocean Breeze)</option>
              <option value="/images/bottle6.jpg">Bottle 6 (Rose Noir)</option>
              <option value="/images/bottle7.jpg">Bottle 7 (Velvet Saffron)</option>
              <option value="/images/bottle8.jpg">Bottle 8 (Midnight Leather)</option>
              <option value="/images/bottle9.jpg">Bottle 9 (Silver Musk)</option>
              <option value="/images/bottle10.jpg">Bottle 10 (Royal Iris)</option>
            </select>
          </div>

          {/* ── Descriptions ─────────────────────────────────────────────────── */}
          <div className="form-group">
            <label>Short Description *</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Brief one-line summary..." required />
          </div>

          <div className="form-group">
            <label>Full Description</label>
            {/* The longer narrative shown on the individual product page */}
            <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={3} placeholder="Detailed fragrance backstory and accords..." />
          </div>

          {/* ── Fragrance notes: Top, Heart, Base ────────────────────────────── */}
          {/* Enter as comma-separated values — the handler splits them into arrays */}
          <div className="form-row">
            <div className="form-group">
              <label>Top Notes (comma separated)</label>
              <input type="text" name="topNotes" value={formData.topNotes} onChange={handleChange} placeholder="Saffron, Bergamot" />
            </div>
            <div className="form-group">
              <label>Heart Notes</label>
              <input type="text" name="heartNotes" value={formData.heartNotes} onChange={handleChange} placeholder="Taif Rose, Oud" />
            </div>
            <div className="form-group">
              <label>Base Notes</label>
              <input type="text" name="baseNotes" value={formData.baseNotes} onChange={handleChange} placeholder="Amber, Vetiver" />
            </div>
          </div>

          {/* ── Badge + Featured flag ─────────────────────────────────────────── */}
          <div className="form-row form-row--center">
            <div className="form-group">
              <label>Badge</label>
              <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. New or Bestseller" />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                Featured on Homepage
              </label>
            </div>
          </div>

          {/* ── Form footer: Cancel + Submit ──────────────────────────────────── */}
          <div className="add-modal-footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            {/* Disable the button while the API call is in progress */}
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Adding...' : 'Save Perfume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
