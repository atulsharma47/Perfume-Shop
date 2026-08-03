// ─────────────────────────────────────────────────────────────────────────────
// client/src/App.js  –  Root component and application shell
//
// This file wires together all the top-level providers and sets up routing.
// The component tree looks like this:
//
//   ToastProvider          ← supplies the toast() notification function globally
//     CartProvider         ← supplies cart state (items, totals, drawer) globally
//       Router             ← React Router: enables <Link> and <Route> anywhere below
//         CartToastBridge  ← connects the cart's notification to the toast system
//         ScrollToTop      ← scrolls the window to the top on every route change
//         Navbar           ← always visible at the top
//         CartDrawer       ← slide-in shopping bag panel (always mounted, hidden by default)
//         <main>           ← the page content area
//           Routes         ← renders the matching page component
//         Footer           ← always visible at the bottom
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider, useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import './index.css';

// ── CartToastBridge ───────────────────────────────────────────────────────────
// CartContext needs to fire toasts when items are added, but it lives *outside*
// ToastContext in the tree.  This tiny bridge component sits inside both contexts
// and passes the toast() function into CartContext via setToastFn() so they can
// communicate without prop-drilling.
function CartToastBridge() {
  const { setToastFn } = useCart();
  const { toast } = useToast();
  useEffect(() => { setToastFn(toast); }, [toast, setToastFn]);
  return null; // renders nothing — it's purely a side-effect component
}

// ── ScrollToTop ───────────────────────────────────────────────────────────────
// Without this, React Router keeps the previous scroll position when navigating
// between pages (e.g. you'd land halfway down a product page after clicking a card).
// This component listens to route changes and resets the scroll every time.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

// ── AnimatedPage ──────────────────────────────────────────────────────────────
// Wraps each page in a div with the "page-fade" class so CSS can apply a
// fade-in transition whenever a new page mounts.
function AnimatedPage({ children }) {
  return <div className="page-fade">{children}</div>;
}

// ── App ───────────────────────────────────────────────────────────────────────
// The outermost shell — mostly concerned with nesting providers in the correct
// order and defining the two client-side routes.
function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          {/* Utility components that don't render visible UI */}
          <CartToastBridge />
          <ScrollToTop />

          {/* Persistent layout elements */}
          <Navbar />
          <CartDrawer />

          {/* Page content swaps out based on the current URL */}
          <main>
            <Routes>
              {/* "/" → the main shop homepage */}
              <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
              {/* "/product/:id" → individual product detail page */}
              <Route path="/product/:id" element={<AnimatedPage><ProductPage /></AnimatedPage>} />
              {/* "/checkout" → checkout page (currently a coming-soon placeholder) */}
              <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
            </Routes>
          </main>

          <Footer />
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
