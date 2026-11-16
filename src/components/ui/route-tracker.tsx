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

  // Remember this page's scroll offset once scrolling settles (trailing
  // 150ms debounce) instead of a synchronous sessionStorage write every frame.
  // Deliberately NOT saved in the effect cleanup: by the time cleanup runs on
  // a route change the router may already have reset scrollY, which would
  // overwrite the real offset with 0 and break SmartBackLink's restore.
  useEffect(() => {
    let timer = 0;
    const save = () => {
      timer = 0;
      try {
        sessionStorage.setItem(`nav:scroll:${pathname}`, String(Math.round(window.scrollY)));
      } catch { /* ignore */ }
    };
    const onScroll = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(save, 150);
    };
    // A click or key press always precedes an in-app navigation, so flushing
    // here captures the exact offset even if the debounce hasn't fired yet.
    const flush = () => { if (timer) window.clearTimeout(timer); save(); };
    save();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', flush, { capture: true, passive: true });
    document.addEventListener('keydown', flush, { capture: true, passive: true });
    window.addEventListener('pagehide', flush);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', flush, { capture: true });
      document.removeEventListener('keydown', flush, { capture: true });
      window.removeEventListener('pagehide', flush);
    };
  }, [pathname]);

  return null;
}
