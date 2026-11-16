'use client';

import dynamic from 'next/dynamic';
import { useJourneyTier } from '@/lib/journey/tier';

const JourneyCanvas = dynamic(() => import('./JourneyCanvas'), { ssr: false });

/** Mounts the depth canvas only in the full tier (desktop, fine pointer, WebGL2, motion OK). */
export function JourneyCanvasLoader() {
  return useJourneyTier() === 'full' ? <JourneyCanvas /> : null;
}
