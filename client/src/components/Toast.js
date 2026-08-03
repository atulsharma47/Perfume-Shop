// ─────────────────────────────────────────────────────────────────────────────
// client/src/components/Toast.js  –  Global notification / toast system
//
// Provides a lightweight in-app notification system with three types:
//   success (green check)  – e.g. "Added to bag"
//   error   (red X)        – e.g. form validation failures
//   info    (circle i)     – e.g. general messages
//
// Usage:
//   1. Wrap your app with <ToastProvider>
//   2. Call const { toast } = useToast() in any component
//   3. Call toast({ message: '...', type: 'success', duration: 3000 })
//
// Toasts auto-dismiss after `duration` ms (default: 3 seconds).
// Each toast also has a manual ✕ dismiss button.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

// ── ToastProvider ─────────────────────────────────────────────────────────────
// Manages the list of active toasts in state and renders them in a fixed container
// at the bottom-right of the screen.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // We use useCallback so the toast function reference stays stable between renders.
  // This matters because CartContext stores this function in a ref — if the reference
  // changed every render, the ref would always hold a stale version.
  const toast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    // Generate a unique ID using timestamp + random number so React's key prop works correctly
    const id = Date.now() + Math.random();

    // Add the new toast to the list
    setToasts((prev) => [...prev, { id, message, type }]);

    // Schedule auto-dismissal after the given duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // Manual dismiss — called when the user clicks the ✕ button on a toast
  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Fixed overlay container for all active toasts.
          aria-live="polite" makes screen readers announce new toasts. */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            {/* Icon changes based on toast type */}
            <span className="toast__icon">
              {t.type === 'success' && (
                // Checkmark icon for success toasts
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {t.type === 'error' && (
                // X icon for error toasts
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
              {t.type === 'info' && (
                // Circle with "i" for informational toasts
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              )}
            </span>

            <span className="toast__message">{t.message}</span>

            {/* Manual dismiss button */}
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── useToast ──────────────────────────────────────────────────────────────────
// Hook to access the toast() function from any component inside ToastProvider.
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
