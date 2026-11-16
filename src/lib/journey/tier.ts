'use client';

import { useSyncExternalStore } from 'react';

/**
 * How much of the photo journey a device gets.
 * - full: desktop with a fine pointer and WebGL2, so the depth canvas runs on top of the CSS layers.
 * - lite: phones, tablets and anything without WebGL2, with CSS photo layers only.
 * - still: prefers-reduced-motion, so still photos and no scroll choreography.
 */
export type JourneyTier = 'full' | 'lite' | 'still';

const REDUCED = '(prefers-reduced-motion: reduce)';
const DESKTOP = '(pointer: fine) and (min-width: 1024px)';

let webgl2: boolean | undefined;
function hasWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      webgl2 = !!document.createElement('canvas').getContext('webgl2');
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function snapshot(): JourneyTier {
  if (matchMedia(REDUCED).matches) return 'still';
  if (matchMedia(DESKTOP).matches && hasWebGL2()) return 'full';
  return 'lite';
}

function subscribe(onChange: () => void) {
  const queries = [matchMedia(REDUCED), matchMedia(DESKTOP)];
  queries.forEach((q) => q.addEventListener('change', onChange));
  return () => queries.forEach((q) => q.removeEventListener('change', onChange));
}

export function useJourneyTier(): JourneyTier {
  return useSyncExternalStore(subscribe, snapshot, () => 'lite');
}
