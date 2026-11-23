'use client';

import React from 'react';

/**
 * A stat that counts up once when it scrolls into view: "90%+" runs 0 → 90 and keeps
 * its "%+". Values that don't start with a number (or "R² = 0.982") render as written.
 * The final text is server-rendered, so readers without JS or with reduced motion
 * (and the content tests) always see the real value.
 */
export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    const m = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value);
    if (!el || !m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const commas = num.includes(',');
    const fmt = (v: number) => {
      const s = v.toFixed(decimals);
      return commas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals }) : s;
    };
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${pre}${fmt(target * eased)}${post}`;
        if (p < 1) raf = requestAnimationFrame(step);
        else el.textContent = value;
      };
      el.textContent = `${pre}${fmt(0)}${post}`;
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{value}</span>;
}
