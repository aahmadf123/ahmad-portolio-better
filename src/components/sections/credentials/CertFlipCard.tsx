'use client';

import React, { useState } from 'react';
import { MONO, SANS, SkillChip, FG3 } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import type { Cert } from '@/lib/data/certs';

/**
 * 3D flip badge: front is the badge graphic + issuer; back is what was learned
 * plus verify/certificate links. Flips on hover/focus, toggles on tap.
 * Reduced motion: both faces stack with no rotation (handled by the global
 * animation kill-switch + the noflip fallback class).
 */
export function CertFlipCard({ cert }: { cert: Cert }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cfc"
      style={{ perspective: 1100, minHeight: 320 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${cert.issuer} ${cert.title} - flip for details`}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((v) => !v); } }}
        onFocus={() => setFlipped(true)}
        onBlur={() => setFlipped(false)}
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
        <div className="cfc-face" style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          border: `1px solid ${cert.color}38`, borderRadius: 12,
          background: `linear-gradient(160deg, ${cert.color}10, var(--surface) 60%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 14, padding: 22, textAlign: 'center',
        }}>
          <Pic src={cert.badgeImage} alt="" sizes="108px" style={{ width: 108, height: 108, objectFit: 'contain', borderRadius: 12, background: `${cert.color}14`, border: `1px solid ${cert.color}33`, padding: 8 }} />
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: cert.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{cert.issuer} · {cert.track}</div>
            <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.25, marginTop: 6 }}>{cert.title}</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Earned {cert.earned} · flip ↻</div>
        </div>

        {/* back */}
        <div className="cfc-face cfc-back" style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          border: `1px solid ${cert.color}55`, borderRadius: 12,
          background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 12, padding: '22px 24px',
        }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: cert.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>What it covers</div>
          <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.65, color: 'var(--text2)', margin: 0 }}>{cert.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cert.skills.map((s) => <SkillChip key={s} color={cert.color}>{s}</SkillChip>)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            {cert.verifyUrl && <a href={cert.verifyUrl} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 10, color: cert.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Verify Badge ↗</a>}
            {cert.certificateUrl && <a href={cert.certificateUrl} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Certificate ↓</a>}
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
