'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';

const loadFeatures = () => import('./features').then((m) => m.default);

// reducedMotion="user": every framer animation (modal morph, skill card, About
// lens, docs tabs, ...) honours the visitor's reduced-motion setting, not just
// the components that check useReducedMotion themselves.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
