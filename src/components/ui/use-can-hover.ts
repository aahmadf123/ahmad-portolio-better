'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/**
 * True on devices with a real hover pointer (mouse/trackpad). Touch screens
 * get false, so hover-only reveals can show their content another way.
 * Server render assumes hover (the desktop audience in PRODUCT.md); phones
 * correct on hydration.
 */
export function useCanHover() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
