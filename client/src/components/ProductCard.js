// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/ProductCard.js  –  Product grid card
//
// Renders a single perfume product in the shop grid.
// Clicking anywhere on the card navigates to the full product detail page.
//
// Features:
//   - Parallax tilt effect (react-parallax-tilt) with a subtle gold glare
//   - Image lazy-loads with a skeleton placeholder while loading
//   - Wishlist heart toggle (local state — no backend persistence yet)
//   - "Add to cart" button with a brief ✓ confirmation animation (1.5s)
//   - Optional badge ("New", "Bestseller", "Limited")
//   - Star rating display and review count
//   - Original (crossed-out) price shown if product has a discount
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Tilt from 'react-parallax-tilt';
import './ProductCard.css';

// ── Stars ─────────────────────────────────────────────────────────────────────
// Small helper component that renders a row of 5 star SVGs.
// Stars up to Math.round(rating) are filled; the rest are hollow.
function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`star ${s <= Math.round(rating) ? 'star--filled' : ''}`}
          width="10" height="10" viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

// ── ProductCard ───────────────────────────────────────────────────────────────
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [imgLoaded, setImgLoaded] = useState(false); // controls skeleton visibility
  const [added,    setAdded]    = useState(false);  // brief "added" feedback state
  const [wished,   setWished]   = useState(false);  // local wishlist toggle

  // Format price as Indian Rupees with no decimal places
  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  // ── handleAdd ───────────────────────────────────────────────────────────────
  // Adds the product to the cart and shows a brief ✓ on the button.
  // e.stopPropagation() prevents the card's onClick (navigate) from firing too.
  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // reset button after 1.5 seconds
  };

  // ── handleWish ──────────────────────────────────────────────────────────────
  // Toggles the wishlist heart. Currently only stored in local component state
  // (no API call) — a future enhancement would persist this to a user profile.
  const handleWish = (e) => {
    e.stopPropagation(); // prevent card click / navigation
    setWished((w) => !w);
  };

  return (
    <article
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)} // clicking the card goes to detail page
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product._id}`)} // keyboard accessible
      aria-label={`View ${product.name} by ${product.brand}`}
    >
      {/* Badge (e.g. "New", "Bestseller") — only rendered if the product has one */}
      {product.badge && (
        <span className={`product-card__badge product-card__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist heart button — fills in when active */}
      <button
        className={`product-card__wish ${wished ? 'product-card__wish--active' : ''}`}
        onClick={handleWish}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>

      {/* Parallax tilt wrapper — gives a 3D depth effect on mouse hover.
          glareEnable adds a soft gold sheen moving across the image surface. */}
      <Tilt
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        glareEnable={true}
        glareMaxOpacity={0.08}
        glareColor="#c9a96e"
        glarePosition="all"
        scale={1.03}          // slight zoom on hover
        transitionSpeed={800} // smooth return to flat after hover
        className="product-card__img-wrap"
      >
        {/* Skeleton placeholder — shows a grey shimmer while the real image loads */}
        {!imgLoaded && <div className="product-card__img-skeleton" />}

        <img
          src={product.thumbnailImage}
          alt={product.name}
          className={`product-card__img product-card__img--float ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)} // swap from skeleton once image is ready
          loading="lazy"                    // defer loading until card is near the viewport
        />

        {/* "View Details" overlay that appears on hover */}
        <div className="product-card__overlay">
          <span className="product-card__cta">View Details</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </Tilt>

      {/* ── Product info section ─────────────────────────────────────────────── */}
      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="product-card__brand">{product.brand}</span>
          <span className="product-card__category">{product.category}</span>
        </div>

        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        {/* Star rating + numeric rating + review count */}
        <div className="product-card__rating">
          <Stars rating={product.rating} />
          <span className="product-card__rating-num">{product.rating}</span>
          <span className="product-card__review-count">({product.reviewCount})</span>
        </div>

        {/* Footer: price + add to cart button */}
        <div className="product-card__footer">
          <div className="product-card__price-wrap">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            {/* Show a crossed-out "was" price if a discount applies */}
            {product.originalPrice && (
              <span className="product-card__original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Add to cart button — shows a checkmark icon briefly after clicking */}
          <button
            className={`product-card__add ${added ? 'product-card__add--added' : ''}`}
            onClick={handleAdd}
            aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
          >
            {added ? (
              // ✓ icon shown for 1.5s after adding
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            ) : (
              // + icon in default state
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
