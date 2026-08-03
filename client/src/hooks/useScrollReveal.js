// ─────────────────────────────────────────────────────────────────────────────
// client/src/hooks/useScrollReveal.js  –  Custom hook for scroll-triggered animations
//
// Usage:
//   const ref = useScrollReveal('.reveal');
//   <section ref={ref}>
//     <div className="reveal">I'll animate in when scrolled into view</div>
//   </section>
//
// How it works:
//   - Uses the browser's IntersectionObserver API to watch elements
//   - Once an element enters the viewport, the "revealed" class is added to it
//   - The observer then stops watching that element (one-shot animation)
//   - The CSS handles the actual transition (opacity/transform) via .reveal and .revealed classes
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

/**
 * Adds a 'revealed' class to elements matching `selector` inside `containerRef`
 * when they scroll into view.
 *
 * @param {string} selector - CSS selector for elements to watch (default: '.reveal')
 * @returns {React.RefObject} - attach this ref to the container element you want to scope the search to
 */
export default function useScrollReveal(selector = '.reveal') {
  // containerRef lets callers scope the element search to a specific DOM subtree.
  // If no ref is attached to any element, we fall back to querying the whole document.
  const containerRef = useRef(null);

  useEffect(() => {
    // Query inside the container if provided, otherwise scan the full page
    const elements = containerRef.current
      ? containerRef.current.querySelectorAll(selector)
      : document.querySelectorAll(selector);

    // Nothing to observe — bail out early to avoid creating a pointless observer
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is now visible — trigger the CSS animation by adding the class
            entry.target.classList.add('revealed');
            // Unobserve immediately so the animation only plays once (not on scroll-back)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,          // Trigger when at least 12% of the element is visible
        rootMargin: '0px 0px -40px 0px' // Shrink the bottom of the viewport by 40px so
                                        // elements animate a bit before they fully enter view
      }
    );

    // Start watching each matching element
    elements.forEach((el) => observer.observe(el));

    // Cleanup: disconnect the observer when the component unmounts or selector changes
    return () => observer.disconnect();
  }, [selector]);

  return containerRef;
}
