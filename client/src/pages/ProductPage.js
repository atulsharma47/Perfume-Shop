import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Tilt from 'react-parallax-tilt';
import './ProductPage.css';

const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ─── Helpers ─────────────────────────────────────────────────── */
function Stars({ rating, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" style={{ gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`star star--lg ${s <= (hover || Math.round(rating)) ? 'star--filled' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(s)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const fmt = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

/* ─── Main component ───────────────────────────────────────────── */
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToBag, setAddedToBag] = useState(false);

  // Gallery
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Size selector
  const [selectedSize, setSelectedSize] = useState(null);

  // Share popup
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review form
  const [reviewForm, setReviewForm] = useState({ user: '', rating: 0, title: '', body: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data.data);
        if (data.data.sizes?.length) setSelectedSize(data.data.sizes[0]);
      } catch (e) {
        // Fallback to local catalog if API unavailable
        const FALLBACK_PRODUCTS = [
          {
            _id: 'prod_1', name: 'Noir Absolu', brand: 'Maison Lumière', tagline: 'The darkness that seduces',
            description: 'A bold oud-leather accord wrapped in midnight rose and smoky incense.',
            fullDescription: 'Noir Absolu is an ode to dusk — the precise moment the sky surrenders its last blue. A dense opening of smoked leather and oud resin gives way to a heart of Taif rose and black pepper, settling into a base of labdanum, vetiver, and skin-warm musks.',
            price: 4200, originalPrice: 5500, category: 'Oriental', gender: 'Unisex', concentration: 'Extrait de Parfum',
            sizes: [{ ml: 30, price: 2800, inStock: true }, { ml: 50, price: 4200, inStock: true }],
            images: ['/images/bottle1_nobg.png', '/images/bottle2_nobg.png', '/images/bottle3_nobg.png', '/images/bottle4_nobg.png'],
            thumbnailImage: '/images/bottle1_nobg.png',
            notes: { top: ['Smoked Leather', 'Black Pepper'], heart: ['Taif Rose', 'Oud Resin'], base: ['Labdanum', 'Vetiver'] },
            rating: 4.8, reviewCount: 3, badge: 'Bestseller',
            reviews: [
              { user: 'Aryan M.', rating: 5, title: 'Absolutely magnetic', body: 'I wore this to a dinner and got three compliments before the appetisers arrived.', date: new Date() },
              { user: 'Priya S.', rating: 5, title: 'Worth every rupee', body: 'The sillage is extraordinary.', date: new Date() }
            ]
          },
          {
            _id: 'prod_2', name: 'Alba Bianca', brand: 'Maison Lumière', tagline: 'Light before the world wakes',
            description: 'White florals lifted by yuzu and morning dew on sun-warmed sandalwood.',
            fullDescription: 'Alba Bianca captures the sensory silence of dawn: dew on gardenias, soft citrus light, and sandalwood warming beneath a winter sun.',
            price: 3600, category: 'Floral', gender: 'Women', concentration: 'Eau de Parfum',
            sizes: [{ ml: 30, price: 2200, inStock: true }, { ml: 50, price: 3600, inStock: true }],
            images: ['/images/bottle2_nobg.png', '/images/bottle3_nobg.png', '/images/bottle4_nobg.png'],
            thumbnailImage: '/images/bottle2_nobg.png',
            notes: { top: ['Yuzu', 'Green Tea'], heart: ['Gardenia', 'Jasmine'], base: ['Sandalwood', 'Musk'] },
            rating: 4.6, reviewCount: 2, badge: 'New',
            reviews: [{ user: 'Sneha R.', rating: 5, title: 'My everyday scent', body: 'Effortless and elegant.', date: new Date() }]
          }
        ];
        const match = FALLBACK_PRODUCTS.find(p => p._id === id || p.name.toLowerCase().includes(id.toLowerCase())) || FALLBACK_PRODUCTS[0];
        setProduct(match);
        if (match.sizes?.length) setSelectedSize(match.sizes[0]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ─── Share ───── */
  const shareUrl = window.location.href;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ─── Review submit ───── */
  const submitReview = async () => {
    const { user, rating, title, body } = reviewForm;
    if (!user || !rating || !title || !body) {
      setReviewError('Please fill in all fields and select a rating.');
      return;
    }
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/products/${id}/reviews`, reviewForm);
      setProduct(data.data);
      setReviewForm({ user: '', rating: 0, title: '', body: '' });
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (e) {
      setReviewError(e.response?.data?.error || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  /* ─── Add to cart ───── */
  const handleAddToBag = () => {
    addToCart(product, selectedSize);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  /* ─── Render states ───── */
  if (loading) return <div className="pp__loading container">Loading…</div>;
  if (error || !product) return (
    <div className="pp__error container">
      <p>{error}</p>
      <button className="btn btn--ghost" onClick={() => navigate('/')}>Back to home</button>
    </div>
  );

  const currentPrice = selectedSize ? selectedSize.price : product.price;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="pp">
      {/* Lightbox */}
      {lightbox && (
        <div className="pp__lightbox" onClick={() => setLightbox(false)}>
          <img src={product.images[activeImg]} alt="" />
          <button className="pp__lightbox-close" onClick={() => setLightbox(false)}>✕</button>
        </div>
      )}

      <div className="container pp__container">
        {/* Breadcrumb */}
        <div className="pp__breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Top: Gallery + Details */}
        <div className="pp__top">
          {/* Gallery */}
          <div className="pp__gallery">
            {/* Thumbnails */}
            <div className="pp__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pp__thumb ${activeImg === i ? 'pp__thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <Tilt
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={true}
              glareMaxOpacity={0.06}
              glareColor="#c9a96e"
              glarePosition="all"
              scale={1.02}
              transitionSpeed={1000}
              className="pp__main-img-wrap"
              onClick={() => setLightbox(true)}
            >
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="pp__main-img pp__main-img--float"
              />
              <div className="pp__zoom-hint">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                  <path d="M9 11h4M11 9v4"/>
                </svg>
                Zoom
              </div>
              {product.badge && (
                <span className={`pp__badge pp__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
            </Tilt>
          </div>

          {/* Details */}
          <div className="pp__details">
            <div className="pp__meta">
              <span className="pp__brand">{product.brand}</span>
              <div className="pp__rating-row">
                <Stars rating={product.rating} />
                <span>{product.rating}</span>
                <span className="pp__review-link" onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}>
                  {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <h1 className="pp__name">{product.name}</h1>
            <p className="pp__tagline">{product.tagline}</p>

            <div className="pp__price-row">
              <span className="pp__price">{fmt(currentPrice)}</span>
              {product.originalPrice && (
                <>
                  <span className="pp__was">{fmt(product.originalPrice)}</span>
                  <span className="pp__discount">{discount}% off</span>
                </>
              )}
            </div>

            <div className="pp__attrs">
              {[
                { k: 'Category', v: product.category },
                { k: 'For', v: product.gender },
                { k: 'Concentration', v: product.concentration },
              ].map(({ k, v }) => (
                <div key={k} className="pp__attr">
                  <span className="pp__attr-key">{k}</span>
                  <span className="pp__attr-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="pp__sizes">
                <p className="pp__size-label">Select Size</p>
                <div className="pp__size-btns">
                  {product.sizes.map((s) => (
                    <button
                      key={s.ml}
                      className={`pp__size-btn ${selectedSize?.ml === s.ml ? 'active' : ''} ${!s.inStock ? 'oos' : ''}`}
                      onClick={() => s.inStock && setSelectedSize(s)}
                      disabled={!s.inStock}
                    >
                      <span className="pp__size-ml">{s.ml}ml</span>
                      <span className="pp__size-price">{fmt(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pp__actions">
              <button
                className={`btn pp__add-btn ${addedToBag ? 'btn--added' : 'btn--primary'}`}
                disabled={selectedSize && !selectedSize.inStock}
                onClick={handleAddToBag}
              >
                {selectedSize && !selectedSize.inStock
                  ? 'Out of Stock'
                  : addedToBag
                  ? '✓ Added to Bag'
                  : 'Add to Bag'}
              </button>
              <button className="pp__wish-btn" aria-label="Wishlist">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
              <button className="pp__wish-btn" aria-label="Share" onClick={() => setShareOpen(!shareOpen)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
              </button>
            </div>

            {/* Share popup */}
            {shareOpen && (
              <div className="pp__share-popup">
                <p className="pp__share-title">Share this fragrance</p>
                <div className="pp__share-platforms">
                  {[
                    { name: 'Twitter/X', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${product.name} — ${product.tagline}`)}`, color: '#1d9bf0' },
                    { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(`${product.name} — ${product.tagline} ${shareUrl}`)}`, color: '#25d366' },
                    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: '#1877f2' },
                    { name: 'Pinterest', url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(product.name)}`, color: '#e60023' },
                  ].map((p) => (
                    <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="pp__share-platform" style={{ '--platform-clr': p.color }}>
                      {p.name}
                    </a>
                  ))}
                </div>
                <div className="pp__share-link">
                  <span className="pp__share-url">{shareUrl.slice(0, 40)}…</span>
                  <button className="pp__copy-btn" onClick={copyLink}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="pp__desc">
              <p>{product.fullDescription}</p>
            </div>
          </div>
        </div>

        {/* Fragrance Pyramid */}
        {product.notes && (
          <section className="pp__pyramid">
            <p className="section-eyebrow">Fragrance profile</p>
            <h2 className="pp__section-h2">The Notes</h2>
            <div className="gold-line" />
            <div className="pp__notes-grid">
              {[
                { tier: 'Top Notes', notes: product.notes.top, delay: '0s' },
                { tier: 'Heart Notes', notes: product.notes.heart, delay: '0.15s' },
                { tier: 'Base Notes', notes: product.notes.base, delay: '0.3s' },
              ].map(({ tier, notes, delay }) => (
                <div key={tier} className="pp__notes-col" style={{ animationDelay: delay }}>
                  <div className="pp__notes-tier">{tier}</div>
                  <ul className="pp__notes-list">
                    {notes.map((n) => (
                      <li key={n}>
                        <span className="pp__note-dot" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="pp__reviews" id="reviews">
          <p className="section-eyebrow">Community</p>
          <h2 className="pp__section-h2">Reviews</h2>
          <div className="gold-line" />

          {/* Summary bar */}
          <div className="pp__review-summary">
            <div className="pp__review-score">
              <span className="pp__review-big">{product.rating}</span>
              <Stars rating={product.rating} />
              <span className="pp__review-total">{product.reviewCount} reviews</span>
            </div>
            <div className="pp__review-bars">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = product.reviews.filter((r) => Math.round(r.rating) === s).length;
                const pct = product.reviews.length ? (count / product.reviews.length) * 100 : 0;
                return (
                  <div key={s} className="pp__bar-row">
                    <span className="pp__bar-label">{s}</span>
                    <div className="pp__bar-track">
                      <div className="pp__bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="pp__bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="pp__review-list">
            {product.reviews.length === 0 ? (
              <p className="pp__no-reviews">No reviews yet. Be the first to share your experience.</p>
            ) : (
              product.reviews.map((r, i) => (
                <div key={i} className="pp__review-card">
                  <div className="pp__review-header">
                    <div className="pp__review-avatar">{r.user[0]}</div>
                    <div>
                      <p className="pp__review-user">{r.user}</p>
                      <p className="pp__review-date">
                        {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <h4 className="pp__review-title">{r.title}</h4>
                  <p className="pp__review-body">{r.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Add review form */}
          <div className="pp__review-form">
            <h3 className="pp__form-title">Write a Review</h3>

            {reviewSuccess && (
              <div className="pp__form-success">
                ✓ Thank you — your review has been published.
              </div>
            )}
            {reviewError && <p className="pp__form-error">{reviewError}</p>}

            <div className="pp__form-rating">
              <label>Your rating</label>
              <Stars
                rating={reviewForm.rating}
                interactive
                onRate={(r) => setReviewForm((f) => ({ ...f, rating: r }))}
              />
            </div>

            <div className="pp__form-row">
              <div className="pp__form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={reviewForm.user}
                  onChange={(e) => setReviewForm((f) => ({ ...f, user: e.target.value }))}
                />
              </div>
              <div className="pp__form-group">
                <label>Review Title</label>
                <input
                  type="text"
                  placeholder="Summarise your experience"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
            </div>

            <div className="pp__form-group">
              <label>Your Review</label>
              <textarea
                rows={4}
                placeholder="Tell others what you think…"
                value={reviewForm.body}
                onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
              />
            </div>

            <button
              className="btn btn--primary"
              onClick={submitReview}
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? 'Submitting…' : 'Publish Review'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
