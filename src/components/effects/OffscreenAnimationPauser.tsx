'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Pauses CSS animations inside any <section> (or [data-pause-offscreen]
 * element) that is off-screen. The site has a lot of ambient infinite loops -
 * Story scene dashes and drifts, pulses, carets, glows - and many of them
 * animate paint-only properties (stroke-dashoffset, box-shadow), so letting
 * them run out of view costs main-thread time on every frame for nothing.
 *
 * One IntersectionObserver for the whole page sets `data-offscreen` on the
 * element; globals.css pauses animations under it. Renders nothing.
 */
export function OffscreenAnimationPauser() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute('data-offscreen');
          else e.target.setAttribute('data-offscreen', '');
        }
      },
      { rootMargin: '200px 0px' }
    );
    // Wait a frame so the new route's sections are in the DOM.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('section, [data-pause-offscreen]').forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.querySelectorAll('[data-offscreen]').forEach((el) => el.removeAttribute('data-offscreen'));
    };
  }, [pathname]);

  return null;
}
