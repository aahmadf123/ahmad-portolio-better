'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let instance: Lenis | null = null;

/** The running Lenis instance, or null (touch screens, reduced motion, before mount). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Gliding wheel and trackpad scroll: each wheel step eases to its target instead of
 * jumping, so the photo fly-ins and parallax move like film. Lenis drives the real
 * window scroll, so sticky stages, anchors and scroll listeners keep working.
 *
 * Off for touch screens (their own momentum scrolling is already smooth) and for
 * reduced motion. Paused whenever something locks the page (a project, the lightbox,
 * the mobile menu all set `body.style.overflow = hidden`); dialogs and anything marked
 * `data-lenis-prevent` scroll natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) {
      // Touch: native scrolling, but still mark the page while it moves so decorative
      // loops hold still (globals.css), the same as Lenis's lenis-scrolling class.
      const root = document.documentElement;
      let t = 0;
      const onScroll = () => {
        if (!t) root.classList.add('is-scrolling');
        window.clearTimeout(t);
        t = window.setTimeout(() => { t = 0; root.classList.remove('is-scrolling'); }, 180);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => { window.removeEventListener('scroll', onScroll); window.clearTimeout(t); root.classList.remove('is-scrolling'); };
    }
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
      prevent: (node) => !!node.closest?.('[role="dialog"], [data-lenis-prevent]'),
    });
    instance = lenis;
    const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    sync();
    return () => {
      mo.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
