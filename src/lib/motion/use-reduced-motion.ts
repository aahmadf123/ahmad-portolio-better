'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const q = matchMedia(QUERY);
  q.addEventListener('change', onChange);
  return () => q.removeEventListener('change', onChange);
}

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion. Framer's hook reads
 * the media query during the hydration render, so for reduced-motion visitors the
 * client's first render (e.g. `initial={false}`) disagreed with the server HTML and
 * React threw error #418 and rebuilt the page. This returns false while hydrating
 * (matching the server) and the real preference right after. Motion itself is still
 * tamed by <MotionConfig reducedMotion="user"> in lib/motion/lazy.tsx.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
