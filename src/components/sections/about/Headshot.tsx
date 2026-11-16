'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';

const HEADSHOT_SRCSET = '/Images/optimized/headshot-480.webp 480w, /Images/optimized/headshot-800.webp 800w';

/**
 * Ahmad's headshot, moved from the hero into About for the photo journey (a cut-out
 * portrait over a stock photo would read as fake). Opens the 1600w copy in the lightbox.
 */
export function Headshot() {
  const openLb = useLightboxOpen();
  return (
    // A real button (keyboard + screen reader) instead of a clickable image element.
    <button
      type="button"
      onClick={() => openLb('/Images/optimized/headshot-1600.webp', 'Ahmad Firas')}
      aria-label="Enlarge photo of Ahmad Firas"
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, margin: 0, border: 'none', background: 'none', cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/optimized/headshot-800.webp"
        srcSet={HEADSHOT_SRCSET}
        sizes="(max-width: 860px) 92vw, 320px"
        width={800}
        height={1376}
        loading="lazy"
        decoding="async"
        alt="Ahmad Firas"
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 460, objectFit: 'cover', objectPosition: 'center top' }}
      />
      <div aria-hidden style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(13,14,18,0.62)', borderRadius: 4, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 5, pointerEvents: 'none' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text2)', textTransform: 'uppercase' }}>Enlarge</span>
      </div>
    </button>
  );
}
