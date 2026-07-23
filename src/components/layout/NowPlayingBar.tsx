'use client';

import React, { useEffect, useState } from 'react';
import { site } from '@/lib/data/site';
import { MONO } from '@/components/shared/section-helpers';

/**
 * Persistent "Now Playing" status pill (bottom-left, desktop): Ahmad's current
 * focus from site.ts, with equalizer micro-bars. Dismiss persists per session.
 */
export function NowPlayingBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(sessionStorage.getItem('npDismissed') === '1');
  }, []);

  if (hidden) return null;
  const np = site.nowPlaying;

  return (
    <div
      className="np-bar"
      style={{
        position: 'fixed',
        left: 20,
        bottom: 'calc(22px + env(safe-area-inset-bottom))',
        zIndex: 9400,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px 10px 14px',
        borderRadius: 10,
        border: '1px solid var(--bd2)',
        background: 'rgba(15,17,23,0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 12px 30px -14px rgba(0,0,0,0.7)',
      }}
    >
      <span aria-hidden className="np-eq" style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
        <i /><i /><i />
      </span>
      <a href={np.href} style={{ textDecoration: 'none', minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: MONO, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>{np.label}</span>
        <span style={{ display: 'block', fontFamily: MONO, fontSize: 11, color: 'var(--text2)', letterSpacing: '0.02em', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{np.detail}</span>
      </a>
      <button
        onClick={() => { setHidden(true); try { sessionStorage.setItem('npDismissed', '1'); } catch { /* private mode */ } }}
        aria-label="Dismiss now playing"
        style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 12, padding: '2px 4px' }}
      >✕</button>

      <style>{`
        @media (max-width: 900px) { .np-bar { display: none !important; } }
        .np-eq i { display: block; width: 3px; background: var(--primary); border-radius: 4px; height: 5px; }
        @media (prefers-reduced-motion: no-preference) {
          .np-eq i { animation: np-eq 1s ease-in-out infinite; }
          .np-eq i:nth-child(2) { animation-delay: 0.2s; }
          .np-eq i:nth-child(3) { animation-delay: 0.4s; }
        }
        @keyframes np-eq { 0%, 100% { height: 5px; } 50% { height: 12px; } }
      `}</style>
    </div>
  );
}
