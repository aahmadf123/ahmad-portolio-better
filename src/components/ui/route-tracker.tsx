'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
const jumpTo = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });

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
/** True while a saved offset is being re-applied (it must not be re-saved half-way). */
let restoring = false;

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
          const apply = () => jumpTo(saved);
          restoring = true; // don't save the half-restored offset meanwhile
          apply();
          let tries = 0;
          const iv = setInterval(() => {
            if (Math.abs(window.scrollY - saved) <= 2 || ++tries > 20) {
              clearInterval(iv);
              restoring = false;
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
    // Once the reader has clicked through to another page, stop saving: while the new
    // page renders, the old one's scroll gets clamped (a shorter page), and saving that
    // would overwrite the real offset SmartBackLink restores later.
    let leaving = false;
    const save = () => {
      timer = 0;
      if (leaving || restoring || window.location.pathname !== pathname) return;
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
    const flush = (e?: Event) => {
      if (timer) window.clearTimeout(timer);
      save();
      const a = (e?.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (a && a.origin === window.location.origin && a.pathname !== pathname && !a.target) {
        leaving = true;
        // (no navigation after all, e.g. a new-tab click or a press dragged away: resume)
        window.setTimeout(() => { leaving = false; }, 3000);
      }
    };
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
