'use client';

import React from 'react';
import { Section, SH, useReveal, MONO, SERIF, FG2 } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { press } from '@/lib/data/press';
import { sectionById } from '@/lib/data/sections';

export function PressSection() {
  const { ref, visible } = useReveal();
  const openLb = useLightboxOpen();
  const def = sectionById('signals')!;
  const feature = press[0];
  return (
    <Section id="signals">
      <SH n={def.n} label="Featured In" sub="Press coverage and public recognition." color={def.color} />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ background: 'rgba(244,244,242,0.025)', border: '1px solid var(--bd)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0 }} className="featured-in-grid">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, background: 'var(--surface)', width: '100%', height: '100%', minHeight: 220 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.image} alt={feature.imageAlt} title="Click to enlarge" onClick={() => openLb(feature.image, feature.imageAlt)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', cursor: 'zoom-in' }} />
          </div>
          <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.9 }}>Featured In</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.3 }}>
              {feature.headline}
            </h3>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--primary)', marginTop: 10, letterSpacing: '0.04em' }}>{feature.outlet} · {feature.date}</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: FG2, marginTop: 14, maxWidth: 560 }}>
              {feature.summary}
            </p>
            <a
              href={feature.url}
              target="_blank" rel="noopener noreferrer"
              data-magnetic=""
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '9px 18px', border: '1px solid rgba(45,212,191,0.27)', borderRadius: 6, color: 'var(--primary)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', width: 'fit-content', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,212,191,0.07)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(45,212,191,0.27)'; }}
            >Read Article ↗</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.featured-in-grid{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}
