import React from 'react';
import { HAND } from '@/components/shared/section-helpers';

/** Handwritten close, set still: Caveat in ink, no animation. */
export function SignOff({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="signoff">
      <div style={{ fontFamily: HAND, fontSize: 'var(--fs-signature)', color: 'var(--foreground)', lineHeight: 1.15 }}>{text}</div>
      <div style={{ fontFamily: HAND, fontSize: 24, color: 'var(--text2)', marginTop: 6 }}>{sub}</div>
      <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 10 }}>Toledo, OH · est. chapter one</div>
      <style>{`.signoff { margin-top: clamp(48px, 7vw, 96px); padding-top: 28px; border-top: 1px solid var(--bd); }`}</style>
    </div>
  );
}
