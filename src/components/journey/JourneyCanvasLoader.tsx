'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useJourneyTier } from '@/lib/journey/tier';

const JourneyCanvas = dynamic(() => import('./JourneyCanvas'), { ssr: false });

/**
 * Mounts the depth canvas only in the full tier (desktop, fine pointer, WebGL2, motion
 * OK), and only once the page has loaded and gone idle: its chunk and ~1MB of textures
 * must never compete with the opening photo (the LCP). Until then the CSS photos show.
 */
export function JourneyCanvasLoader() {
  const full = useJourneyTier() === 'full';
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!full) return;
    let handle = 0;
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      handle = ric(() => setIdle(true), { timeout: 3000 } as IdleRequestOptions) as unknown as number;
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (handle && window.cancelIdleCallback) window.cancelIdleCallback(handle);
    };
  }, [full]);

  return full && idle ? <JourneyCanvas /> : null;
}
