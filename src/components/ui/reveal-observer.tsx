'use client';

import { useEffect } from 'react';

const SELECTOR = '.rv, .rv-left, .rv-right, .rv-fade, .rv-pop, .rv-ring, .rv-photo, .draw-rule';

/**
 * One IntersectionObserver for every entrance on the site (the rv-* classes in
 * globals.css): adds `in` once, as the element comes into view, then forgets it. One DOM
 * write per element, ever, and the CSS transition finishes and releases its layer.
 * Elements added later (client navigation, lazily rendered parts) are picked up by a
 * MutationObserver that only looks at added nodes.
 */
export function RevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    const watch = (root: ParentNode) => {
      if (root instanceof Element && root.matches(SELECTOR) && !root.classList.contains('in')) io.observe(root);
      root.querySelectorAll?.(SELECTOR).forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
    };
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => { if (n instanceof Element) watch(n); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
