'use client';
import React from 'react';

/**
 * Threshold-crossing scroll flag: true once window.scrollY > threshold.
 * The listener is passive and rAF-throttled (one read per frame, at most),
 * and the setter only fires when the boolean actually flips.
 */
export function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const apply = React.useCallback(() => {
    const next = window.scrollY > threshold;
    setScrolled((prev) => (prev === next ? prev : next));
  }, [threshold]);

  React.useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [apply]);

  React.useEffect(() => {
    apply();
  }, [apply]);

  return scrolled;
}
