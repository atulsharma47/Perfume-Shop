// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/HeroBanner.js  –  Full-screen homepage hero section
//
// The first thing visitors see. Contains:
//   - An animated canvas with floating gold particles for atmosphere
//   - A luxury background image with a dark gradient overlay
//   - A headline, sub-copy, and two CTA buttons (passed in as props)
//   - A floating "Featured Scent" detail card on the right
//   - A "Scroll" indicator at the bottom
//
// Props:
//   onExplore  – called when the "Explore Collection" button is clicked
//   onStory    – called when the "Our Story" button is clicked
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

export default function HeroBanner({ onExplore, onStory }) {
  // Reference to the <canvas> element so we can draw particles on it
  const particlesRef = useRef(null);

  // ── Floating particle animation ─────────────────────────────────────────────
  // Draws 60 small gold circles that slowly float upward, creating a dreamy
  // atmosphere effect without any external animation library.
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let raf; // requestAnimationFrame ID — stored so we can cancel it on cleanup

    // Keep the canvas pixel dimensions in sync with its CSS display size
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 60 particles with randomised positions, sizes, speeds, and opacity
    const particles = Array.from({ length: 60 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2 + 0.3,          // radius: 0.3–1.5px
      vy:    -(Math.random() * 0.4 + 0.1),       // vertical speed (negative = upward)
      vx:    (Math.random() - 0.5) * 0.2,        // slight horizontal drift
      alpha: Math.random() * 0.6 + 0.2,          // opacity: 0.2–0.8
    }));

    // Main animation loop — clears the canvas and redraws all particles each frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${p.alpha})`; // gold tone matching brand palette
        ctx.fill();
        // Move the particle
        p.x += p.vx;
        p.y += p.vy;
        // When a particle floats off the top, reset it to the bottom at a random x position
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    // Cleanup: cancel the animation loop and remove the resize listener when
    // this component unmounts (e.g. user navigates away from the homepage)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []); // empty deps → runs once on mount

  return (
    <section className="hero">
      {/* Canvas sits on top of the background but below the text content */}
      <canvas ref={particlesRef} className="hero__particles" />

      {/* Background: luxury product photo + dark gradient overlay for text readability */}
      <div className="hero__bg">
        <img
          src="/images/luxury_hero.jpg"
          alt="Luxury Signature Perfume"
          className="hero__bg-img"
        />
        <div className="hero__overlay" /> {/* Dark translucent layer over the photo */}
      </div>

      {/* Main content area */}
      <div className="hero__content container">
        <div className="hero__text">
          {/* Small label above the headline — common in luxury brand design */}
          <p className="section-eyebrow hero__eyebrow">New Collection — 2025</p>

          {/* Main headline with an italic emphasis word */}
          <h1 className="hero__headline">
            Wear the&nbsp;<em>invisible</em><br />
            with intention
          </h1>

          <p className="hero__body">
            Six new compositions. Each one a fragment of a world you've never visited
            but will immediately recognise.
          </p>

          {/* CTA buttons — callbacks let the parent (HomePage) control what happens */}
          <div className="hero__actions">
            <button onClick={onExplore} className="btn btn--primary">Explore Collection</button>
            <button onClick={onStory}   className="btn btn--ghost">Our Story</button>
          </div>
        </div>

        {/* ── Featured Scent card ──────────────────────────────────────────────
            This floating info card is a design accent — hardcoded to the flagship
            product "Noir Absolu". In a v2 you'd pull this from the API. */}
        <div className="hero__card">
          <p className="hero__card-label">Featured Scent</p>
          <p className="hero__card-name">Noir Absolu</p>
          <p className="hero__card-notes">Oud · Taif Rose · Vetiver</p>
          {/* Animated progress bar — purely decorative, adds motion to the card */}
          <div className="hero__card-bar">
            <div className="hero__card-bar-fill" />
          </div>
          <p className="hero__card-price">₹4,200</p>
        </div>
      </div>

      {/* Scroll indicator at the very bottom — hints to the user to scroll down */}
      <div className="hero__scroll">
        <span>Scroll</span>
        <div className="hero__scroll-line" /> {/* Animated vertical line */}
      </div>
    </section>
  );
}
