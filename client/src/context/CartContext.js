// ─────────────────────────────────────────────────────────────────────────────
// client/src/context/CartContext.js  –  Global shopping cart state
//
// Provides cart data and actions to any component in the tree via React Context.
// Internally uses useReducer for predictable state updates (similar to Redux
// but without the extra library).
//
// Cart items are persisted to localStorage so the bag survives page refreshes.
//
// Exposed values (via useCart hook):
//   items          – array of cart items, each with a unique _key
//   totalItems     – total quantity across all items
//   totalPrice     – sum of (price × quantity) for all items
//   drawerOpen     – boolean that controls the CartDrawer slide-in panel
//   setDrawerOpen  – directly open or close the drawer
//   addToCart      – add a product (optionally a specific size) to the cart
//   removeFromCart – remove an item by its _key
//   updateQty      – change quantity for an item (removes it if qty drops below 1)
//   clearCart      – empty the entire cart
//   setToastFn     – lets App.js inject the toast notification function
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

// ── cartReducer ───────────────────────────────────────────────────────────────
// Handles all state transitions for the cart.
// Each action.type maps to a clear, immutable update — we never mutate state
// directly, which keeps React's rendering predictable.
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      // Build a unique key from product ID + selected size so the same perfume
      // in different sizes (e.g. 50ml vs 100ml) is treated as separate cart lines.
      const key = `${action.item._id}-${action.item.size ?? 'default'}`;
      const existing = state.find((i) => i._key === key);

      if (existing) {
        // Product + size combo already in cart — just bump the quantity
        return state.map((i) =>
          i._key === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Brand new entry — append it with quantity 1
      return [...state, { ...action.item, _key: key, quantity: 1 }];
    }

    case 'REMOVE':
      // Filter out the item matching the given unique key
      return state.filter((i) => i._key !== action.key);

    case 'UPDATE_QTY':
      // If the new quantity is 0 or less, treat it as a removal
      if (action.qty < 1) return state.filter((i) => i._key !== action.key);
      return state.map((i) =>
        i._key === action.key ? { ...i, quantity: action.qty } : i
      );

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

// ── loadCart ──────────────────────────────────────────────────────────────────
// Reads the cart from localStorage on first render.
// If the stored JSON is malformed for any reason, we just start with an empty cart
// rather than crashing the whole app.
function loadCart() {
  try {
    const stored = localStorage.getItem('ml_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ── CartProvider ──────────────────────────────────────────────────────────────
// Wrap your app (or a subtree) with this to give all children access to cart
// state and actions via the useCart() hook.
export function CartProvider({ children }) {
  // Initialize the reducer with whatever was saved in localStorage
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // We store the toast function in a ref rather than state because updating it
  // shouldn't cause a re-render of the whole cart tree.
  const toastRef = React.useRef(null);

  // Every time the cart changes, persist the latest version to localStorage
  useEffect(() => {
    localStorage.setItem('ml_cart', JSON.stringify(items));
  }, [items]);

  // Allow the toast function to be injected after the component mounts
  // (CartToastBridge in App.js calls this once ToastContext is available)
  const setToastFn = (fn) => { toastRef.current = fn; };

  // ── addToCart ───────────────────────────────────────────────────────────────
  // Dispatches the ADD action, automatically opens the drawer, and fires a
  // success toast so the user gets instant visual feedback.
  const addToCart = (product, selectedSize = null) => {
    // Use the selected size's price if one was chosen, otherwise the base price
    const price = selectedSize ? selectedSize.price : product.price;
    dispatch({
      type: 'ADD',
      item: {
        _id:            product._id,
        name:           product.name,
        brand:          product.brand,
        thumbnailImage: product.thumbnailImage,
        price,
        size: selectedSize?.ml ?? null, // null means "no specific size selected"
      },
    });
    setDrawerOpen(true);
    if (toastRef.current) {
      toastRef.current({
        message: `${product.name} added to your bag`,
        type: 'success',
      });
    }
  };

  // Simple dispatch wrappers so consumers don't need to know action shapes
  const removeFromCart = (key) => dispatch({ type: 'REMOVE', key });
  const updateQty = (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  // Derived totals — computed fresh on every render from the items array
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        setToastFn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── useCart ───────────────────────────────────────────────────────────────────
// Custom hook that components use to access cart state and actions.
// Throws a helpful error if called outside of a CartProvider so bugs are easy to track.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
