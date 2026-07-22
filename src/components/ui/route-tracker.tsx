'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Navigation memory for SmartBackLink, mounted once in the root layout.
 *
 * Tracks two things in sessionStorage:
 * - 'nav:prev' / 'nav:curr': the previous in-app pathname, so a back control
 *   can tell "came from inside the site" apart from a deep link.
 * - 'nav:scroll:<pathname>': the latest scroll offset per pathname, because
 *   this Next version does not restore scroll on client-side history back -
 *   after a SmartBackLink back-navigation ('nav:restore' is set to the
 *   destination pathname), the saved offset is re-applied manually.
 *
 * Renders nothing.
 */
export function RouteTracker() {
  const pathname = usePathname();

  // Record route transitions + restore scroll after a smart back.
  useEffect(() => {
    try {
      const curr = sessionStorage.getItem('nav:curr');
      if (curr !== pathname) {
        sessionStorage.setItem('nav:prev', curr ?? '');
        sessionStorage.setItem('nav:curr', pathname);
      }

      if (sessionStorage.getItem('nav:restore') === pathname) {
        sessionStorage.removeItem('nav:restore');
        const saved = Number(sessionStorage.getItem(`nav:scroll:${pathname}`));
        if (Number.isFinite(saved) && saved > 0) {
          // The router scrolls to top on commit; re-apply the saved offset
          // and keep re-applying (up to ~4s) because late layout (images,
          // lazy sections) can leave the document too short and clamp the
          // offset until content finishes streaming in. The loop stops for
          // good the first time the offset sticks, so a reader who then
          // scrolls isn't fought.
          const apply = () => window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
          apply();
          let tries = 0;
          const iv = setInterval(() => {
            if (Math.abs(window.scrollY - saved) <= 2 || ++tries > 20) {
              clearInterval(iv);
              return;
            }
            apply();
          }, 200);
        }
      }
    } catch {
      // Storage unavailable - back controls fall back to their hrefs.
    }
  }, [pathname]);

  // Continuously remember this page's scroll offset (throttled to rAF).
  useEffect(() => {
    let raf = 0;
    const save = () => {
      raf = 0;
      try {
        sessionStorage.setItem(`nav:scroll:${pathname}`, String(Math.round(window.scrollY)));
      } catch { /* ignore */ }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(save); };
    save();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  return null;
}
