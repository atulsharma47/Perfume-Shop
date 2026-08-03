// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/CartDrawer.js  –  Slide-in shopping bag panel
//
// This is a side-drawer that slides in from the right when the user interacts
// with the cart (clicking the bag icon, adding a product, etc.).
//
// Features:
//   - Semi-transparent backdrop that closes the drawer when clicked
//   - Body scroll is locked while the drawer is open (prevents background scroll)
//   - Escape key closes the drawer for keyboard accessibility
//   - Empty-state with a prompt to browse the collection
//   - Per-item quantity stepper (+ / −) that removes the item if qty reaches 0
//   - Subtotal calculation with Indian Rupee formatting
//   - "Proceed to Checkout" and "Continue Shopping" buttons
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

// Helper: format a number as Indian Rupees (₹4,200 style, no decimal places)
const fmt = (p) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(p);

export default function CartDrawer() {
  const { items, totalItems, totalPrice, drawerOpen, setDrawerOpen, removeFromCart, updateQty } =
    useCart();
  const navigate = useNavigate();

  // ── Body scroll lock ────────────────────────────────────────────────────────
  // When the drawer is open, lock the main page scroll so the user doesn't
  // accidentally scroll the homepage behind the panel.
  // The cleanup restores scroll when the drawer closes or the component unmounts.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // ── Escape key to close ─────────────────────────────────────────────────────
  // Standard UX pattern: pressing Escape should close any modal/drawer.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setDrawerOpen]);

  // Closes the drawer and navigates to the checkout page.
  // We also explicitly reset body overflow here as a safety measure — without it,
  // if React batches the state update after navigation, the scroll lock stays on.
  const goToCheckout = () => {
    setDrawerOpen(false);
    document.body.style.overflow = ''; // immediately restore scroll
    navigate('/checkout');
  };

  // Closes the drawer and smoothly scrolls to the product grid on the homepage.
  // The 350ms timeout gives React Router time to navigate before we try to find
  // the "collections" element — without it, the element might not exist yet.
  const browseCollection = () => {
    setDrawerOpen(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('collections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  return (
    <>
      {/* Backdrop — clicking it closes the drawer */}
      <div
        className={`cart-backdrop ${drawerOpen ? 'cart-backdrop--visible' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true" // hidden from screen readers (the drawer itself has the label)
      />

      {/* The actual drawer panel — slides in via CSS transform */}
      <aside className={`cart-drawer ${drawerOpen ? 'cart-drawer--open' : ''}`} aria-label="Shopping cart">

        {/* Header: title, item count, and close button */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-row">
            <h2 className="cart-drawer__title">Your Bag</h2>
            {/* Only show the count when there's something in the bag */}
            {totalItems > 0 && (
              <span className="cart-drawer__count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button className="cart-drawer__close" onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__divider" />

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <p className="cart-drawer__empty-title">Your bag is empty</p>
            <p className="cart-drawer__empty-sub">Discover our collection and find your signature scent.</p>
            <button className="btn btn--ghost cart-drawer__browse-btn" onClick={browseCollection}>
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            {/* ── Item list ─────────────────────────────────────────────────── */}
            <ul className="cart-drawer__items">
              {items.map((item) => (
                <li key={item._key} className="cart-item">
                  {/* Product thumbnail */}
                  <div className="cart-item__img-wrap">
                    <img src={item.thumbnailImage} alt={item.name} className="cart-item__img" />
                  </div>

                  {/* Product details */}
                  <div className="cart-item__info">
                    <p className="cart-item__brand">{item.brand}</p>
                    <p className="cart-item__name">{item.name}</p>
                    {/* Only show size if a specific ml size was selected */}
                    {item.size && (
                      <p className="cart-item__size">{item.size}ml</p>
                    )}

                    <div className="cart-item__footer">
                      {/* Quantity stepper: − [qty] + */}
                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQty(item._key, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-item__qty-num">{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQty(item._key, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {/* Line total = unit price × quantity */}
                      <span className="cart-item__price">{fmt(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  {/* Remove item button */}
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item._key)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Footer: subtotal + checkout actions ────────────────────────── */}
            <div className="cart-drawer__footer">
              <div className="cart-drawer__divider" />
              <div className="cart-drawer__subtotal">
                <span className="cart-drawer__subtotal-label">Subtotal</span>
                <span className="cart-drawer__subtotal-price">{fmt(totalPrice)}</span>
              </div>
              <p className="cart-drawer__shipping-note">Shipping &amp; taxes calculated at checkout</p>
              <button className="btn btn--primary cart-drawer__checkout-btn" onClick={goToCheckout}>
                Proceed to Checkout
              </button>
              <button className="cart-drawer__continue" onClick={() => setDrawerOpen(false)}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
