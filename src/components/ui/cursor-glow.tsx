'use client';

import { useEffect } from 'react';

const HOT = 'a[href], button, [role="button"], input, textarea, select, label, summary';

/**
 * The system cursor, plus a soft teal glow that follows it and lights up the photo and
 * cards underneath. It eases toward the pointer, tightens and brightens over anything
 * clickable, and fades out when the pointer leaves the window. Mouse and trackpad only;
 * under reduced motion it follows exactly instead of easing.
 *
 * Cheap by construction: one fixed element moved with `translate` (compositor only),
 * a rAF loop that runs only while the glow is catching up and stops once it has, and
 * no layout reads.
 */
export function CursorGlow() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = document.createElement('div');
    el.setAttribute('data-cursor-glow', '');
    el.setAttribute('aria-hidden', 'true');
    el.appendChild(document.createElement('span'));
    document.body.appendChild(el);

    let tx = -1000, ty = -1000, x = tx, y = ty;
    let raf = 0;
    let shown = false;
    let hot = false;
    const place = () => { el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`; };
    const step = () => {
      raf = 0;
      const k = reduced ? 1 : 0.2;
      x += (tx - x) * k;
      y += (ty - y) * k;
      if (Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3) { x = tx; y = ty; place(); return; }
      place();
      raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX; ty = e.clientY;
      if (!shown) { x = tx; y = ty; place(); el.classList.add('on'); shown = true; }
      const now = !!(e.target as Element | null)?.closest?.(HOT);
      if (now !== hot) { hot = now; el.classList.toggle('hot', hot); }
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onLeave = () => { shown = false; el.classList.remove('on'); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      el.remove();
    };
  }, []);
  return null;
}
