'use client';

import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { MONO, HAND } from '@/components/shared/section-helpers';
import { PlayDiagram } from '@/components/sections/projects/PlayDiagram';
import { fireConfetti } from './confetti';

const SECRET = 'football';

/**
 * Hidden play: typing "football" anywhere (outside inputs) runs a play - field
 * overlay, animated routes, teal/gold confetti, and a toast. Disabled under
 * reduced motion.
 */
export function FootballEasterEgg() {
  const [active, setActive] = useState(false);

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
        fireConfetti();
        try { posthog.capture('easter_egg_football'); } catch { /* analytics optional */ }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setActive(false), 3600);
    return () => window.clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      onClick={() => setActive(false)}
      role="dialog"
      aria-label="Hidden play unlocked"
      style={{
        position: 'fixed', inset: 0, zIndex: 99998,
        background: 'rgba(8,9,12,0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 18, padding: 24, cursor: 'pointer',
        animation: 'egg-in 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{ width: 'min(680px, 92vw)' }}>
        <PlayDiagram loop={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: HAND, fontSize: 20, color: 'var(--gold)' }}>Blitz unlocked - Go Rockets!</div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginTop: 8 }}>
          You typed the magic word · click anywhere to resume
        </div>
      </div>
      <style>{`@keyframes egg-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
