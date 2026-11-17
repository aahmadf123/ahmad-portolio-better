'use client';

import React, { useState } from 'react';
import { Section, SH, MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { Pic } from '@/components/ui/pic';
import { press } from '@/lib/data/press';
import { testimonials, type Testimonial } from '@/lib/data/testimonials';
import { sectionById } from '@/lib/data/sections';

/**
 * Quote theater: the real press feature anchors the stage; testimonials added
 * to lib/data/testimonials.ts float in as depth-staggered quote cards (no
 * placeholder fakes - the section ships honest). Clicking a card brings it
 * forward.
 */
export function SignalsSection() {
  const def = sectionById('signals')!;
  const openLb = useLightboxOpen();
  const [front, setFront] = useState<number | null>(null);
  const feature = press[0];

  return (
    <Section id="signals">
      <SH n={def.n} label="Signals" sub="Press, recognition, and - as they arrive - words from the people behind the work." color={def.color} variant="sub" />

      <div className="signals-stage" style={{ display: 'grid', gridTemplateColumns: testimonials.length > 0 ? 'minmax(0, 58fr) minmax(0, 42fr)' : '1fr', gap: 'clamp(18px, 3vw, 36px)', alignItems: 'start' }}>
        {/* press anchor */}
        {feature && (
          <div
            className="rv"
            style={{
              background: 'rgba(244,244,242,0.025)',
              border: '1px solid var(--bd)',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 24px 60px -30px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0 }} className="featured-in-grid">
              <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', minHeight: 210 }}>
                <Pic src={feature.image} alt={feature.imageAlt} title="Click to enlarge" onClick={() => openLb(feature.image, feature.imageAlt)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', cursor: 'zoom-in' }} />
              </div>
              <div style={{ padding: '26px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, opacity: 0.9 }}>Featured In</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 'var(--fs-featured-title)', fontWeight: 400, color: 'var(--foreground)', lineHeight: 1.3 }}>
                  “{feature.headline}”
                </h3>
                <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--primary)', marginTop: 10, letterSpacing: '0.04em' }}>{feature.outlet} · {feature.date}</div>
                <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.75, color: FG2, marginTop: 12, maxWidth: 560 }}>
                  {feature.summary}
                </p>
                <a
                  href={feature.url}
                  target="_blank" rel="noopener noreferrer"
                  data-magnetic=""
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, padding: '9px 18px', border: '1px solid rgba(45,212,191,0.27)', borderRadius: 6, color: 'var(--primary)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content', transition: 'all 0.2s' }}
                >Read Article ↗</a>
              </div>
            </div>
          </div>
        )}

        {/* testimonial theater */}
        {testimonials.length > 0 ? (
          <div style={{ position: 'relative', perspective: 900 }}>
            {testimonials.map((t, i) => (
              <QuoteCard key={t.name} t={t} i={i} front={front === i} onFront={() => setFront(i)} />
            ))}
          </div>
        ) : (
          <div aria-hidden style={{ display: 'none' }} />
        )}
      </div>

      {testimonials.length === 0 && (
        <p style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 18 }}>
          Endorsements from collaborators land here as they arrive.
        </p>
      )}

      <style>{`@media(max-width:700px){.featured-in-grid{grid-template-columns:1fr!important}.signals-stage{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}

function QuoteCard({ t, i, front, onFront }: { t: Testimonial; i: number; front: boolean; onFront: () => void }) {
  const angle = [(-2.2), 1.6, -1.1, 2.4][i % 4];
  return (
    <blockquote
      onClick={onFront}
      className="rv-fade signal-quote"
      style={{
        zIndex: front ? 10 : i,
        rotate: `${angle}deg`,
        margin: i === 0 ? 0 : '-14px 0 0 0',
        marginLeft: `${(i % 3) * 10}px`,
        padding: '20px 22px',
        background: 'var(--surface)',
        border: `1px solid ${front ? 'color-mix(in srgb, var(--primary) 45%, transparent)' : 'var(--bd2)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 18px 44px -22px rgba(0,0,0,0.7)',
        animationDelay: `${i * 1.4}s`,
      }}
    >
      <span aria-hidden style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 0.6, color: 'var(--primary)', opacity: 0.5, display: 'block', marginBottom: 8 }}>“</span>
      <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.7, color: 'var(--foreground)' }}>{t.quote}</p>
      <footer style={{ marginTop: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: FG2 }}>{t.name}</div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{t.role} · {t.org}</div>
      </footer>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .signal-quote.in { animation: signal-bob 7s ease-in-out infinite alternate; }
        }
        @keyframes signal-bob { from { translate: 0 -4px; } to { translate: 0 5px; } }
      `}</style>
    </blockquote>
  );
}

