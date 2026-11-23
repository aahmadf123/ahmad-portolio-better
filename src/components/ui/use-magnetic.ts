'use client';

import React from 'react';

/**
 * A small pull toward the pointer (at most `max` px), mouse and trackpad only, never
 * under reduced motion. Returns a ref for the element.
 */
export function useMagnetic<T extends HTMLElement>(max = 6) {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.style.transition = 'transform .35s cubic-bezier(.2,.7,.2,1)';
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate(${(dx * max).toFixed(1)}px, ${(dy * max).toFixed(1)}px)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [max]);
  return ref;
}
