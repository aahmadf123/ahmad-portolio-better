'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { capture } from '@/lib/analytics';

// The overlay pulls in GSAP + the play diagram; load it only when triggered.
const Overlay = dynamic(() => import('./FootballEasterEggOverlay'), { ssr: false });

const SECRET = 'football';

/**
 * Hidden play: typing "football" anywhere (outside inputs) runs a play - field
 * overlay, animated routes, teal/gold confetti, and a toast. Disabled under
 * reduced motion. Only this tiny key listener ships on every route.
 */
export function FootballEasterEgg() {
  const [active, setActive] = useState(false);
  const close = useCallback(() => setActive(false), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = '';
        setActive(true);
        capture('easter_egg_football');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return active ? <Overlay onClose={close} /> : null;
}
