'use client';

import React, { useEffect } from 'react';
import { MONO, HAND } from '@/components/shared/section-helpers';
import { PlayDiagram } from '@/components/sections/projects/PlayDiagram';
import { fireConfetti } from './confetti';

/**
 * The "football" easter egg overlay: field, animated routes, confetti and a
 * toast. Loaded on demand by FootballEasterEgg, so GSAP and the play diagram
 * never ship to pages where nobody types the magic word.
 */
export default function FootballEasterEggOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    fireConfetti();
    const t = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
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
        <div style={{ fontFamily: HAND, fontSize: 'var(--fs-signature)', color: 'var(--gold)' }}>Blitz unlocked - Go Rockets!</div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginTop: 8 }}>
          You typed the magic word · click anywhere to resume
        </div>
      </div>
      <style>{`@keyframes egg-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
