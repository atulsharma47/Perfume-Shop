// ─────────────────────────────────────────────────────────────────────────────
// client/src/index.js  –  React application entry point
//
// This is the very first JavaScript file the browser executes.
// It mounts the root <App /> component into the <div id="root"> element
// defined in public/index.html.
//
// React.StrictMode is enabled — it renders components twice in development
// to catch side effects and deprecated patterns. It has no effect in production.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Grab the root DOM node and create a React root on it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
