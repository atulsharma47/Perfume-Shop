// ─────────────────────────────────────────────────────────────────────────────
// client/src/pages/CheckoutPage.js  –  Checkout "Coming Soon" page
//
// This page is shown when the user clicks "Proceed to Checkout" in the cart drawer.
// The checkout flow is not yet built, so this acts as a polished placeholder
// that clearly communicates the status without leaving the user on a blank screen.
//
// The page:
//   - Shows a friendly "Coming Soon" message in the brand's visual style
//   - Lists the items currently in the cart with a subtotal
//   - Offers a "Continue Shopping" button to go back to the homepage
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

// Format currency as Indian Rupees
const fmt = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, setDrawerOpen } = useCart();

  return (
    <div className="checkout-page">
      <div className="checkout-card">

        {/* Decorative bag icon in a glowing ring */}
        <div className="checkout-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>

        <p className="checkout-eyebrow">Almost there</p>
        <h1 className="checkout-headline">Checkout Coming Soon</h1>
        <p className="checkout-body">
          We're crafting the checkout experience with the same care we put into our fragrances.
          {totalItems > 0
            ? ` Your ${totalItems} item${totalItems !== 1 ? 's' : ''} (${fmt(totalPrice)}) are safely held in your bag.`
            : " Your bag will be waiting for you when it's ready."}
        </p>

        <div className="checkout-divider" />

        {/* Action buttons */}
        <div className="checkout-actions">
          {/* Go back to browsing */}
          <button
            className="btn btn--primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>

          {/* Reopen the cart drawer so they can review what's in it */}
          {totalItems > 0 && (
            <button
              className="btn btn--ghost"
              onClick={() => { navigate('/'); setTimeout(() => setDrawerOpen(true), 300); }}
            >
              View Bag ({totalItems})
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
