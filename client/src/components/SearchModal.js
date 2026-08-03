// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/SearchModal.js  –  Full-screen search overlay
//
// Opens as a full-screen modal when the search icon in the navbar is clicked.
// Fetches the product catalog from the API on first open, then filters locally
// on the client side as the user types — no debounced API calls needed since
// the catalog is small enough to search in memory.
//
// Search matches against: name, brand, category, description, and fragrance notes.
//
// Props:
//   isOpen  – boolean, whether the modal is visible
//   onClose – callback to close the modal
//
// Fallback:
//   If the API is down, a hardcoded FALLBACK_PRODUCTS array ensures the search
//   still works during development or when the backend isn't running.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchModal.css';

// API base URL — pulled from .env in production, defaults to localhost for dev
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper: format prices as Indian Rupees
const fmt = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

// ── Fallback product list ─────────────────────────────────────────────────────
// Used when the backend API is unreachable (e.g. during development without the server).
// Mirrors the seed data so the search feature is always functional.
const FALLBACK_PRODUCTS = [
  { _id: 'prod_1', name: 'Noir Absolu',    brand: 'Maison Lumière', tagline: 'The darkness that seduces',   description: 'A bold oud-leather accord wrapped in midnight rose and smoky incense.',         price: 4200, category: 'Oriental', gender: 'Unisex', concentration: 'Extrait de Parfum', thumbnailImage: '/images/bottle1_nobg.png', rating: 4.8, reviewCount: 3, badge: 'Bestseller', notes: { top: ['Smoked Leather', 'Black Pepper'],   heart: ['Taif Rose', 'Oud Resin'],     base: ['Labdanum', 'Vetiver']          } },
  { _id: 'prod_2', name: 'Alba Bianca',    brand: 'Maison Lumière', tagline: 'Light before the world wakes', description: 'White florals lifted by yuzu and morning dew on sun-warmed sandalwood.',         price: 3600, category: 'Floral',   gender: 'Women',  concentration: 'Eau de Parfum',     thumbnailImage: '/images/bottle2_nobg.png', rating: 4.6, reviewCount: 2, badge: 'New',        notes: { top: ['Yuzu', 'Green Tea'],             heart: ['Gardenia', 'Jasmine'],        base: ['Sandalwood', 'Musk']           } },
  { _id: 'prod_3', name: 'Forêt Sauvage', brand: 'Maison Lumière', tagline: 'Earth, bark, and solitude',    description: 'Moss-covered pine and cold rain over dark patchouli and amber resin.',          price: 3900, category: 'Woody',    gender: 'Men',    concentration: 'Eau de Parfum',     thumbnailImage: '/images/bottle3_nobg.png', rating: 4.7, reviewCount: 2,               notes: { top: ['Pine', 'Cold Rain'],             heart: ['Patchouli', 'Vetiver'],       base: ['Amber Resin', 'Musk']          } },
  { _id: 'prod_4', name: 'Ambre Soleil',  brand: 'Maison Lumière', tagline: 'Warm skin, golden hour',      description: 'Tonka bean and benzoin over neroli and a whisper of saffron and honey.',        price: 3200, category: 'Oriental', gender: 'Unisex', concentration: 'Eau de Toilette',   thumbnailImage: '/images/bottle4_nobg.png', rating: 4.9, reviewCount: 2, badge: 'Bestseller', notes: { top: ['Neroli', 'Saffron'],              heart: ['Tonka Bean', 'Benzoin'],      base: ['Honey', 'Sandalwood']          } },
  { _id: 'prod_5', name: 'Sel Marin',     brand: 'Maison Lumière', tagline: 'Sea salt and distance',       description: 'Driftwood and sea spray on a crisp accord of blue iris and white musks.',       price: 2900, category: 'Aquatic',  gender: 'Unisex', concentration: 'Eau de Toilette',   thumbnailImage: '/images/bottle5_nobg.png', rating: 4.5, reviewCount: 1,               notes: { top: ['Sea Spray', 'Blue Iris'],         heart: ['Driftwood', 'Salt'],          base: ['White Musk', 'Ambergris']      } },
  { _id: 'prod_6', name: 'Rose de Minuit',brand: 'Maison Lumière', tagline: 'Thorns and silk',             description: 'Damask rose amplified by oud, black pepper and a dusk-warmed base.',             price: 4800, category: 'Floral',   gender: 'Women',  concentration: 'Extrait de Parfum', thumbnailImage: '/images/bottle6_nobg.png', rating: 4.9, reviewCount: 4, badge: 'Limited',    notes: { top: ['Black Pepper', 'Bergamot'],       heart: ['Damask Rose', 'Oud'],         base: ['Patchouli', 'Musk']            } },
  { _id: 'prod_7', name: 'Vetiver Sombre',brand: 'Maison Lumière', tagline: 'The earth after rain',        description: 'Smoky vetiver root tempered by bergamot brightness and oakmoss.',                price: 3500, category: 'Woody',    gender: 'Men',    concentration: 'Eau de Parfum',     thumbnailImage: '/images/bottle7_nobg.png', rating: 4.6, reviewCount: 2,               notes: { top: ['Bergamot', 'Grapefruit'],         heart: ['Vetiver', 'Oakmoss'],         base: ['Cedar', 'Amber']               } },
  { _id: 'prod_8', name: 'Cuir Blanc',    brand: 'Maison Lumière', tagline: 'Clean skin, soft leather',    description: 'A minimalist white leather accord with iris, cardamom and warm musks.',           price: 3800, category: 'Leather',  gender: 'Unisex', concentration: 'Eau de Parfum',     thumbnailImage: '/images/bottle8_nobg.png', rating: 4.7, reviewCount: 3,               notes: { top: ['Cardamom', 'Iris'],               heart: ['White Leather', 'Suede'],     base: ['White Musk', 'Sandalwood']     } },
];

// ── SearchModal ───────────────────────────────────────────────────────────────
export default function SearchModal({ isOpen, onClose }) {
  const [query,    setQuery]    = useState('');       // current search string
  const [products, setProducts] = useState([]);       // full product catalog (loaded once)
  const [loading,  setLoading]  = useState(false);   // loading spinner state
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ── Fetch catalog on first open ─────────────────────────────────────────────
  // We only load products the first time the modal opens (products.length === 0).
  // Subsequent opens reuse the cached list to avoid unnecessary API calls.
  // The input is auto-focused after a short delay so the user can type immediately.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (products.length === 0) {
        setLoading(true);
        axios
          .get(`${API}/products`)
          .then((res) => setProducts(res.data.data?.length ? res.data.data : FALLBACK_PRODUCTS))
          .catch(() => setProducts(FALLBACK_PRODUCTS)) // silently fall back if API fails
          .finally(() => setLoading(false));
      }
    } else {
      // Clear the search query when the modal closes so it's fresh next time
      setQuery('');
    }
  }, [isOpen, products.length]);

  // ── Escape key to close ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Don't render anything if the modal is closed (saves DOM nodes)
  if (!isOpen) return null;

  // ── Client-side filtering ───────────────────────────────────────────────────
  // Only filter when the user has actually typed something.
  // Searches across name, brand, category, description, and all fragrance notes.
  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        // Flatten all note layers into a single searchable string
        const notesStr = p.notes
          ? [...(p.notes.top||[]), ...(p.notes.heart||[]), ...(p.notes.base||[])].join(' ').toLowerCase()
          : '';
        return (
          p.name?.toLowerCase().includes(q)        ||
          p.brand?.toLowerCase().includes(q)       ||
          p.category?.toLowerCase().includes(q)    ||
          p.description?.toLowerCase().includes(q) ||
          notesStr.includes(q)
        );
      })
    : []; // Show nothing (just suggestions) when the search bar is empty

  // Close modal and navigate to the selected product's detail page
  const handleSelect = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    /* Backdrop — clicking outside the modal closes it */
    <div className="search-backdrop" onClick={onClose}>
      {/* Modal box — stop click from bubbling up to the backdrop */}
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Search input header ──────────────────────────────────────────── */}
        <div className="search-header">
          {/* Decorative search icon inside the input row */}
          <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search perfumes by name, notes, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Clear button — only shows when there's text in the input */}
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              ✕
            </button>
          )}

          {/* Keyboard hint — clicking it also closes the modal */}
          <button className="search-close-btn" onClick={onClose}>
            Esc
          </button>
        </div>

        {/* ── Body: loading / suggestions / results / no-results ──────────── */}
        <div className="search-body">
          {loading ? (
            // Loading state while fetching the catalog
            <div className="search-status">Loading fragrance catalog...</div>

          ) : !query.trim() ? (
            // Empty state — show popular search suggestions as clickable tags
            <div className="search-suggestions">
              <p className="search-label">Popular Searches</p>
              <div className="search-tags">
                {['Noir Absolu', 'Floral', 'Oud', 'Woody', 'Rose', 'Oriental'].map((tag) => (
                  // Clicking a tag auto-populates the search input
                  <button key={tag} className="search-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          ) : filtered.length === 0 ? (
            // No results for the given query
            <div className="search-status">No perfumes matching "{query}" found.</div>

          ) : (
            // Results grid
            <div className="search-results">
              <p className="search-label">{filtered.length} fragrance{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="search-grid">
                {filtered.map((item) => (
                  <div key={item._id} className="search-item" onClick={() => handleSelect(item._id)}>
                    {/* Product thumbnail */}
                    <div className="search-item-img">
                      <img src={item.thumbnailImage} alt={item.name} />
                    </div>
                    {/* Product details */}
                    <div className="search-item-info">
                      <span className="search-item-brand">{item.brand}</span>
                      <h4 className="search-item-name">{item.name}</h4>
                      <p className="search-item-desc">{item.description}</p>
                      <div className="search-item-footer">
                        <span className="search-item-cat">{item.category}</span>
                        <span className="search-item-price">{fmt(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
