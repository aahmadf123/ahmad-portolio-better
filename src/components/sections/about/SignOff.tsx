'use client';

import React from 'react';
import { m, useReducedMotion, useMotionValue, useTransform, animate } from 'framer-motion';
import { HAND, MONO } from '@/components/shared/section-helpers';

/** Handwritten close: the Caveat script writes itself on (a left→right clip-path
 * reveal), then a hand-drawn underline draws in beneath it.
 *
 * The write-on is a numeric MotionValue mapped to an `inset()` clip-path and
 * animated imperatively, NOT a declarative clip-path keyframe: the declarative
 * clip-path keyframe snapped here in practice (root cause not fully pinned
 * down - likely a missing/unparseable initial value rather than a LazyMotion
 * limitation); the imperative MotionValue + animate() approach tweens reliably
 * and is kept. Animating the MotionValue updates the style every frame, so the
 * reveal genuinely tweens. It's kicked off from the wrapper's onViewportEnter -
 * the same viewport mechanism that drives the wrapper fade and underline draw
 * (once, amount 0.6) - which fires reliably here where a nested useInView did
 * not. Reduced motion short-circuits to the finished state, no animation. */
export function SignOff({ text, sub }: { text: string; sub: string }) {
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? 1 : 0); // 0 = clipped/hidden, 1 = fully written
  const clipPath = useTransform(progress, (v) => `inset(0% ${((1 - v) * 100).toFixed(2)}% 0% 0%)`);

  const runWriteOn = () => {
    if (reduced) {
      progress.set(1);
      return;
    }
    animate(progress, 1, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
  };

  return (
    <div style={{ marginTop: 'clamp(40px, 6vw, 72px)', textAlign: 'center' }}>
      <m.div
        initial={reduced ? false : { opacity: 0, y: 14, rotate: -1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        onViewportEnter={runWriteOn}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-block' }}
      >
        <m.div
          style={{ clipPath, fontFamily: HAND, fontSize: 'clamp(34px, 4.5vw, 54px)', color: 'var(--primary)', lineHeight: 1.15 }}
        >
          {text}
        </m.div>
        <svg viewBox="0 0 320 22" width="min(320px, 70%)" style={{ display: 'block', margin: '2px auto 0' }} aria-hidden>
          <m.path
            d="M 8 14 C 60 8, 120 18, 170 12 S 280 8, 312 13"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 1.0, ease: 'easeInOut' }}
          />
        </svg>
        <div style={{ fontFamily: HAND, fontSize: 24, color: 'var(--text2)', marginTop: 10 }}>{sub}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8 }}>
          Toledo, OH · est. chapter one
        </div>
      </m.div>
    </div>
  );
}
