'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { certPursuits } from '@/lib/data/certs';
import { nowCards } from '@/lib/data/now';

/**
 * "Currently learning" strip — continuous CSS marquee of active pursuits and
 * learning tracks; shimmering gold to signal in-progress work. Pauses on hover;
 * the global reduced-motion kill-switch freezes it into a plain row.
 */
export function LearningMarquee() {
  const learning = nowCards.find((c) => c.category === 'Learning')?.items ?? [];
  const items = [
    ...certPursuits.map((p) => `${p.title} — ${p.sub}`),
    ...learning.map((l) => `${l.title} — ${l.sub}`),
  ];
  const row = items.map((t) => `⟢ ${t}`).join('   ·   ');

  return (
    <div aria-label="Currently learning" style={{ marginTop: 30, border: '1px solid rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.04)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', padding: '12px 16px', borderRight: '1px solid rgba(245,158,11,0.22)', flexShrink: 0, background: 'rgba(245,158,11,0.07)' }}>
          Currently learning
        </span>
        <div className="lm-window" style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, maskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)' }}>
          <div className="lm-track" style={{ display: 'inline-block', padding: '12px 0', fontFamily: MONO, fontSize: 11, letterSpacing: '0.04em', color: 'var(--gold)' }}>
            <span style={{ paddingRight: 48 }}>{row}</span>
            <span aria-hidden style={{ paddingRight: 48 }}>{row}</span>
          </div>
        </div>
      </div>
      <style>{`
        .lm-track { animation: lm-slide 36s linear infinite; }
        .lm-window:hover .lm-track { animation-play-state: paused; }
        @keyframes lm-slide { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .lm-window { white-space: normal !important; }
          .lm-track span[aria-hidden] { display: none; }
        }
      `}</style>
    </div>
  );
}
