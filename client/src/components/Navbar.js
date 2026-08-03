// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/Navbar.js  –  Site-wide navigation bar
//
// Features:
//   - Transparent at the top of the page, turns solid/blurred after scrolling 40px
//   - Desktop links with smooth-scroll to homepage sections (handles cross-page navigation too)
//   - Cart icon with live item count badge
//   - Search modal trigger
//   - "Add Scent" button that opens the admin add-product modal
//   - Mobile hamburger menu that slides in a full-width drawer
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';
import AddProductModal from './AddProductModal';
import './Navbar.css';

// Static nav link definitions — label shown to user, href is an in-page anchor ID
const NAV_LINKS = [
  { label: 'Collections', href: '#collections' },
  { label: 'Bestsellers', href: '#featured' },
  { label: 'Story',       href: '#story' },
  { label: 'Atelier',     href: '#atelier' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);      // true once user scrolls past 40px
  const [menuOpen, setMenuOpen] = useState(false);      // mobile drawer open/closed
  const [searchOpen, setSearchOpen] = useState(false);  // search modal open/closed
  const [addModalOpen, setAddModalOpen] = useState(false); // add-product modal open/closed
  const location = useLocation();
  const { totalItems, setDrawerOpen } = useCart();

  // ── Scroll detection ────────────────────────────────────────────────────────
  // Adds the "navbar--scrolled" class after 40px to switch from transparent to
  // the solid dark background with backdrop blur.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the user navigates to a different route
  useEffect(() => { setMenuOpen(false); }, [location]);

  // ── handleNavClick ──────────────────────────────────────────────────────────
  // Handles clicking a nav anchor link (e.g. "#collections").
  // If the user is already on the homepage, smooth-scroll directly to the section.
  // If they're on a product page, redirect to "/#collections" and let the browser
  // handle the scroll (React Router doesn't support hash routing natively).
  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      // Not on homepage — redirect there with the hash so the browser scrolls
      window.location.href = '/' + href;
      return;
    }
    // On homepage — smooth-scroll with an 80px offset to clear the sticky navbar
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -80; // Height of the fixed navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* navbar--scrolled toggles the solid background + blur */}
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">

          {/* Logo — clicking always goes back to the homepage */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">ML</span>
            <span className="navbar__logo-name">Maison Lumière</span>
          </Link>

          {/* Desktop navigation links (hidden on mobile via CSS) */}
          <ul className="navbar__links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="navbar__link">{l.label}</a>
              </li>
            ))}
          </ul>

          {/* Action buttons on the right side */}
          <div className="navbar__actions">
            {/* Search trigger */}
            <button className="navbar__icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)} title="Search perfumes">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Admin shortcut — opens the add product form */}
            <button
              className="navbar__add-scent-btn"
              onClick={() => setAddModalOpen(true)}
              title="Add new perfume"
            >
              + Add Scent
            </button>

            {/* Cart icon with live badge showing the total item count */}
            <button
              className="navbar__icon-btn navbar__cart-btn"
              aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {/* Only show the badge when there are items in the bag */}
              {totalItems > 0 && (
                <span className="navbar__cart-badge" aria-hidden="true">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger — three animated bars that become an X when open */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Mobile slide-down drawer with the same nav links */}
        <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => { setMenuOpen(false); handleNavClick(e, l.href); }}
              className="navbar__drawer-link"
            >
              {l.label}
            </a>
          ))}
          {/* Also accessible from mobile menu */}
          <button className="navbar__drawer-add-btn" onClick={() => { setMenuOpen(false); setAddModalOpen(true); }}>
            + Add New Perfume
          </button>
        </div>
      </nav>

      {/* Modals are rendered here (outside the nav) so z-index stacking works correctly */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onProductAdded={() => {
          // Simplest approach: reload the page so the new product appears in the grid
          window.location.reload();
        }}
      />
    </>
  );
}
