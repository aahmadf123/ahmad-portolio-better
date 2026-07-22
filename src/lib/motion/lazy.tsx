'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domMax } from 'framer-motion';

// domMax (not domAnimation) - the site relies on layout animations
// (layoutId poster<->modal morph, AnimatePresence mode="popLayout"),
// which domAnimation does not include.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax} strict>{children}</LazyMotion>;
}
