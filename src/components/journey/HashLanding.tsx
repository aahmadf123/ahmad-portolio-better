'use client';

import { useEffect } from 'react';
import { anchorScrollTop } from '@/lib/journey/anchors';

/**
 * Anchors on the photo-journey homepage.
 *
 * 1. Deep links like /#research (including old links shared before the redesign) must
 *    land on their world with its own photo and words showing. The browser's own jump
 *    happens while the page is still settling and aims at the section top (the previous
 *    photo), so re-aim at anchorScrollTop() for up to ~3s until it sticks, and stop for
 *    good as soon as the reader scrolls or presses anything.
 * 2. In-page links (<a href="#…">: "Start the journey", the header nav) are handled
 *    here too. A native hash jump pushes a history entry with null state, which this
 *    Next version's router ignores on Back, stranding the reader on a case study. So:
 *    push the hash with the router's own state, then scroll to the same landing point.
 */
export function HashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    let stopped = !id;
    let tries = 0;
    const stop = () => { stopped = true; };
    const opts = { capture: true, passive: true, once: true } as const;
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchstart', stop, opts);
    window.addEventListener('keydown', stop, opts);
    window.addEventListener('pointerdown', stop, opts);
    const aim = () => {
      if (stopped) return true;
      const top = anchorScrollTop(id);
      if (top === null) return true;
      if (Math.abs(window.scrollY - top) <= 2 && tries > 2) return true;
      window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      return ++tries > 15;
    };
    const iv = window.setInterval(() => { if (aim()) window.clearInterval(iv); }, 200);
    aim();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      const href = a?.getAttribute('href') ?? '';
      if (!href.startsWith('#') || href === '#' || href === '#main') return; // skip link keeps native focus
      const target = decodeURIComponent(href.slice(1));
      const top = anchorScrollTop(target);
      if (top === null) return;
      e.preventDefault();
      stopped = true;
      window.history.pushState(window.history.state, '', `#${target}`);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    };
    document.addEventListener('click', onClick, true);

    return () => {
      window.clearInterval(iv);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('wheel', stop, opts);
      window.removeEventListener('touchstart', stop, opts);
      window.removeEventListener('keydown', stop, opts);
      window.removeEventListener('pointerdown', stop, opts);
    };
  }, []);
  return null;
}
