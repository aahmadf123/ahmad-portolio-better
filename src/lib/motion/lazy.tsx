'use client';

import { LazyMotion, domMax } from 'framer-motion';

// domMax (not domAnimation) — the site relies on layout animations
// (layoutId poster<->modal morph, AnimatePresence mode="popLayout"),
// which domAnimation does not include.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domMax} strict>{children}</LazyMotion>;
}
