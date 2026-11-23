'use client';

import React from 'react';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';

const HEADSHOT_SRCSET = '/Images/optimized/headshot-480.webp 480w, /Images/optimized/headshot-800.webp 800w';

/**
 * Ahmad's headshot, moved from the hero into About for the photo journey (a cut-out
 * portrait over a stock photo would read as fake). Opens the highest-resolution copy in the lightbox.
 */
export function Headshot() {
  const openLb = useLightboxOpen();
  return (
    // A real button (keyboard + screen reader) instead of a clickable image element.
    <button
      type="button"
      onClick={() => openLb('/Images/optimized/headshot-1600.webp', 'Ahmad Firas')}
      aria-label="Enlarge photo of Ahmad Firas"
      style={{ position: 'relative', display: 'block', width: '100%', padding: 0, margin: 0, border: 'none', background: 'none', cursor: 'zoom-in', borderRadius: 3, overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Images/optimized/headshot-800.webp"
        srcSet={HEADSHOT_SRCSET}
        sizes="(max-width: 860px) 92vw, 320px"
        width={768}
        height={960}
        loading="lazy"
        decoding="async"
        alt="Ahmad Firas"
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 460, objectFit: 'cover', objectPosition: 'center top' }}
      />
    </button>
  );
}
