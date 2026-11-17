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
 * Jump straight to `top`, and tell Lenis so it doesn't glide back to where it thought
 * it was going. (Lenis.scrollTo skips a target equal to its remembered one, and that
 * goes stale when the browser scrolls on its own, e.g. to a focused element.)
 */
/** Glide to `top` (Lenis), or the browser's smooth scroll when Lenis is off. */
export function glideTo(top: number, reduced: boolean) {
  if (instance) {
    const y = window.scrollY;
    instance.targetScroll = instance.animatedScroll = y; // start from where we really are
    instance.scrollTo(top, { duration: 1.4, force: true });
    return;
  }
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

export function jumpTo(top: number) {
  // Scroll natively (never clamped by Lenis's possibly stale page height), then tell
  // Lenis where we are. Its immediate jump to the current spot also stops any glide in
  // progress, which would otherwise carry on to its old destination; invalidating the
  // remembered target first keeps that jump from being skipped as "already there".
  window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  if (instance) {
    // stop() halts any glide in progress; then adopt where we really are (no Lenis
    // scrollTo here: it would clamp to its own, possibly stale, page height).
    const locked = document.body.style.overflow === 'hidden';
    instance.stop();
    instance.targetScroll = instance.animatedScroll = window.scrollY;
    if (!locked) instance.start();
  }
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
