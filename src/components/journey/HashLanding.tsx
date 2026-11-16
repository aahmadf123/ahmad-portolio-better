'use client';

import { useEffect } from 'react';

/**
 * Deep links like /#research (including old links shared before the photo journey)
 * must land on their section. The browser's own jump happens while the page is still
 * settling (late images, the tier switch after hydration), so it stops short.
 * Re-aim at the anchor until it sticks, for up to ~3s, and stop for good as soon as
 * the reader scrolls or presses anything, the same pattern as RouteTracker's restore.
 */
export function HashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let stopped = false;
    let tries = 0;
    const stop = () => { stopped = true; };
    const opts = { capture: true, passive: true, once: true } as const;
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchstart', stop, opts);
    window.addEventListener('keydown', stop, opts);
    window.addEventListener('pointerdown', stop, opts);
    const aim = () => {
      const el = document.getElementById(id);
      if (stopped || !el) return true;
      const top = el.getBoundingClientRect().top;
      if (Math.abs(top) <= 2 && tries > 2) return true;
      window.scrollTo({ top: window.scrollY + top, behavior: 'instant' as ScrollBehavior });
      return ++tries > 15;
    };
    const iv = window.setInterval(() => { if (aim()) window.clearInterval(iv); }, 200);
    aim();
    return () => {
      window.clearInterval(iv);
      window.removeEventListener('wheel', stop, opts);
      window.removeEventListener('touchstart', stop, opts);
      window.removeEventListener('keydown', stop, opts);
      window.removeEventListener('pointerdown', stop, opts);
    };
  }, []);
  return null;
}
