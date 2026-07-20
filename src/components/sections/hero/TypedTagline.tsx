'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MONO } from '@/components/shared/section-helpers';

/**
 * Types the tagline segments one by one ("Agentic AI Engineer · Sports
 * Analytics · Researcher"). `instant` renders the finished line.
 */
export function TypedTagline({ segments, active, instant }: { segments: string[]; active: boolean; instant: boolean }) {
  const full = useMemo(() => segments.join(' · '), [segments]);
  const [len, setLen] = useState(instant ? full.length : 0);
  const done = len >= full.length;

  useEffect(() => {
    if (instant) { setLen(full.length); return; }
    if (!active) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= full.length) window.clearInterval(id);
    }, 34);
    return () => window.clearInterval(id);
  }, [active, instant, full]);

  return (
    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', minHeight: 16, display: 'inline-flex', alignItems: 'center' }}>
      <span aria-hidden={!done}>{full.slice(0, len)}</span>
      {/* full text for screen readers regardless of typing state */}
      <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>{full}</span>
      {!done && active && !instant && (
        <span aria-hidden style={{ display: 'inline-block', width: 7, height: 13, marginLeft: 3, background: 'var(--primary)', opacity: 0.7, animation: 'tagline-blink 0.9s step-end infinite' }} />
      )}
      <style>{`@keyframes tagline-blink { 0%,100%{opacity:.7} 50%{opacity:0} }`}</style>
    </span>
  );
}
