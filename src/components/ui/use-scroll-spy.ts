'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Shared scroll-spy for the chapter rail and the header pills.
 *
 * Computes the active section directly from scroll position instead of
 * IntersectionObserver, so the state is correct immediately on mount - a
 * hash landing (/#projects), a browser-back scroll restoration, or a client
 * cache restore all light the right section without waiting for a scroll
 * event. Re-initializes on route change (callers live in the root layout).
 *
 * The active section is the last one whose top edge sits above an
 * activation line 40% down the viewport; at the very bottom of the page the
 * final section wins even if it is too short to reach the line.
 *
 * Pass a module-level constant array of ids - the effect re-runs when the
 * joined id list changes.
 */
export function useScrollSpy(ids: readonly string[]) {
  const pathname = usePathname();
  const [state, setState] = useState({ active: '', found: 0 });
  const idKey = ids.join(',');

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const found = els.length;

    const compute = () => {
      const scrollY = window.scrollY;
      const line = scrollY + window.innerHeight * 0.4;
      let active = '';
      for (const el of els) {
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= line) active = el.id;
      }
      // Bottom clamp: a short final section still lights up when the page
      // can't scroll far enough to push it past the activation line.
      if (found && scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        active = els[found - 1].id;
      }
      setState((prev) =>
        prev.active === active && prev.found === found ? prev : { active, found }
      );
    };

    compute();

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; compute(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, idKey]);

  return state;
}
