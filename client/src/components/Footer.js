// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/Footer.js  –  Site-wide footer
//
// A four-column footer containing:
//   - Brand identity (logo, tagline, social icon links)
//   - "Explore" navigation links (New Arrivals, Collections, etc.)
//   - "Support" links (FAQ, Shipping, etc.)
//   - Newsletter signup input
//   - Copyright and legal links at the very bottom
//
// Note: Most links currently use href="#!" as placeholders.
// Replace with real URLs or React Router <Link> components as pages are built.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* ── Top section: brand + link columns + newsletter ──────────────────── */}
      <div className="footer__top container">

        {/* Brand column — logo, tagline, social links */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-mark">ML</span>
            <span className="footer__logo-name">Maison Lumière</span>
          </div>
          <p className="footer__tagline">
            Artisanal fragrances composed in small batches,<br />
            for those who believe scent is memory.
          </p>
          {/* Social icons — just show the first letter of each platform for now */}
          <div className="footer__socials">
            {['Instagram', 'Pinterest', 'Twitter'].map((s) => (
              <a key={s} href="#!" className="footer__social">{s[0]}</a>
            ))}
          </div>
        </div>

        {/* "Explore" links column — shopping categories */}
        <div className="footer__links-group">
          <h4 className="footer__col-title">Explore</h4>
          <ul>
            {['New Arrivals', 'Collections', 'Gift Sets', 'Travel Sizes', 'Bestsellers'].map((l) => (
              <li key={l}><a href="#!" className="footer__link">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* "Support" links column — customer service pages */}
        <div className="footer__links-group">
          <h4 className="footer__col-title">Support</h4>
          <ul>
            {['Fragrance Guide', 'Shipping & Returns', 'Track Order', 'Care Instructions', 'Contact Us'].map((l) => (
              <li key={l}><a href="#!" className="footer__link">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Newsletter signup — collects email for the brand's "Journal" content */}
        <div className="footer__newsletter">
          <h4 className="footer__col-title">The Journal</h4>
          <p>Notes on fragrance, craft, and the art of slow living.</p>
          <div className="footer__form">
            <input type="email" placeholder="Your email" className="footer__input" />
            {/* Arrow button — would wire up to a newsletter API in production */}
            <button className="footer__submit">→</button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar: copyright + legal links ─────────────────────────────── */}
      <div className="footer__bottom container">
        <p>© 2025 Maison Lumière. All rights reserved.</p>
        <div className="footer__bottom-links">
          <a href="#!">Privacy</a>
          <a href="#!">Terms</a>
          <a href="#!">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
