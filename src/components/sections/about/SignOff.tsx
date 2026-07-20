'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HAND, MONO } from '@/components/shared/section-helpers';

/** Handwritten close: Caveat script with a hand-drawn underline that draws itself in. */
export function SignOff({ text, sub }: { text: string; sub: string }) {
  const reduced = useReducedMotion();
  return (
    <div style={{ marginTop: 'clamp(40px, 6vw, 72px)', textAlign: 'center' }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14, rotate: -1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-block' }}
      >
        <div style={{ fontFamily: HAND, fontSize: 'clamp(34px, 4.5vw, 54px)', color: 'var(--primary)', lineHeight: 1.15 }}>
          {text}
        </div>
        <svg viewBox="0 0 320 22" width="min(320px, 70%)" style={{ display: 'block', margin: '2px auto 0' }} aria-hidden>
          <motion.path
            d="M 8 14 C 60 8, 120 18, 170 12 S 280 8, 312 13"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.25, ease: 'easeInOut' }}
          />
        </svg>
        <div style={{ fontFamily: HAND, fontSize: 24, color: 'var(--text2)', marginTop: 10 }}>{sub}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8 }}>
          Toledo, OH · est. chapter one
        </div>
      </motion.div>
    </div>
  );
}
