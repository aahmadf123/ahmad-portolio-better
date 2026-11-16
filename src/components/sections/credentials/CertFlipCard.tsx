'use client';

import React, { useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import { MONO, SANS, SkillChip, FG3 } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import type { Cert } from '@/lib/data/certs';

/**
 * 3D flip badge: front is the badge graphic + issuer; back is what was learned
 * plus verify/certificate links.
 *
 * - Mouse: flips on hover.
 * - Touch / pen: one tap anywhere on the card toggles it (the old version took
 *   two taps, because the emulated hover and focus flipped it open and the
 *   click flipped it straight back).
 * - Keyboard: real buttons on each face ("Flip" / "Back"); the face turned
 *   away is `inert`, so its links can't be tabbed to while invisible and the
 *   card no longer nests links inside a button.
 * Reduced motion: both faces stack with no rotation and both stay usable.
 */
export function CertFlipCard({ cert }: { cert: Cert }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  const pointerType = useRef<string>('mouse');
  const frontBtn = useRef<HTMLButtonElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);

  const flipTo = (next: boolean, moveFocus = false) => {
    setFlipped(next);
    if (moveFocus) requestAnimationFrame(() => (next ? backBtn : frontBtn).current?.focus());
  };

  const faceBtn: React.CSSProperties = {
    fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: FG3, background: 'none', border: 'none', padding: '6px 8px', cursor: 'pointer',
  };

  return (
    <div
      className="cfc"
      style={{ perspective: 1100, minHeight: 320 }}
      onPointerDown={(e) => { pointerType.current = e.pointerType; }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setFlipped(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setFlipped(false); }}
      onClick={(e) => {
        // Touch/pen tap toggles; links and the face buttons handle themselves.
        if (pointerType.current === 'mouse') return;
        if ((e.target as HTMLElement).closest('a, button')) return;
        setFlipped((v) => !v);
      }}
    >
      <div
        className="cfc-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 320,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer',
        }}
      >
        {/* front */}
        <div className="cfc-face" inert={!reduced && flipped} style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          border: `1px solid ${cert.color}38`, borderRadius: 10,
          background: `linear-gradient(160deg, ${cert.color}10, var(--surface) 60%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 14, padding: 22, textAlign: 'center',
        }}>
          <Pic src={cert.badgeImage} alt="" sizes="108px" style={{ width: 108, height: 108, objectFit: 'contain', borderRadius: 10, background: `${cert.color}14`, border: `1px solid ${cert.color}33`, padding: 8 }} />
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: cert.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{cert.issuer} · {cert.track}</div>
            <h3 style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.25, margin: '6px 0 0' }}>{cert.title}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Earned {cert.earned} ·</span>
            <button
              ref={frontBtn}
              type="button"
              aria-label={`Show details for ${cert.issuer} ${cert.title}`}
              onClick={(e) => { e.stopPropagation(); flipTo(true, e.detail === 0); }}
              style={faceBtn}
            >
              Flip ↻
            </button>
          </div>
        </div>

        {/* back */}
        <div className="cfc-face cfc-back" inert={!reduced && !flipped} style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          border: `1px solid ${cert.color}55`, borderRadius: 10,
          background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', justifyContent: 'safe center',
          gap: 12, padding: '22px 24px',
          overflowY: 'auto', // long descriptions scroll inside the card instead of spilling out
        }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: cert.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>What it covers</div>
          <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.65, color: 'var(--text2)', margin: 0 }}>{cert.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cert.skills.map((s) => <SkillChip key={s} color={cert.color}>{s}</SkillChip>)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            {cert.verifyUrl && <a href={cert.verifyUrl} target="_blank" rel="noopener" style={{ display: 'inline-block', padding: '6px 0', fontFamily: MONO, fontSize: 11, color: cert.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Verify Badge ↗</a>}
            {cert.certificateUrl && <a href={cert.certificateUrl} target="_blank" rel="noopener" style={{ display: 'inline-block', padding: '6px 0', fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Certificate ↓</a>}
            <button
              ref={backBtn}
              type="button"
              aria-label={`Back to the ${cert.title} badge`}
              onClick={(e) => { e.stopPropagation(); flipTo(false, e.detail === 0); }}
              style={{ ...faceBtn, marginLeft: 'auto' }}
            >
              ↺ Back
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .cfc-inner { transform: none !important; }
          .cfc-face { position: relative !important; transform: none !important; margin-bottom: 10px; }
        }
      `}</style>
    </div>
  );
}
