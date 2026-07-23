'use client';

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Section, SH, useReveal, MONO, SERIF, FG2, FG3 } from '@/components/shared/section-helpers';
import { AnimatedFeatureSpotlight } from '@/components/ui/feature-spotlight';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { research } from '@/lib/data/research';
import { sectionById } from '@/lib/data/sections';

export function ResearchSection() {
  const { ref, visible } = useReveal();
  const openLb = useLightboxOpen();
  const def = sectionById('research')!;
  return (
    <Section id="research" style={{ background: 'rgba(17,19,26,0.92)' }}>
      <SH n={def.n} label="Research" sub="Published work and ongoing investigations." color={def.color} />
      {/* marginTop: -30 intentionally collapses this paragraph up against SH's
          own marginBottom: 52 (section-helpers.tsx) - cross-file coupling; if
          SH's bottom margin ever changes, this offset needs revisiting too. */}
      {research.storyLine && (
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 15, color: FG2, maxWidth: 560, lineHeight: 1.65, marginTop: -30, marginBottom: 28 }}>
          {research.storyLine}
        </p>
      )}
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        <AnimatedFeatureSpotlight
          preheaderIcon={<FlaskConical className="h-4 w-4" />}
          preheaderText={research.preheader}
          heading={<><span style={{ color: '#5b8af5' }}>{research.headingAccent}</span> Taxonomy for<br />Autonomous Systems</>}
          description={research.description}
          buttonText={research.buttonText}
          buttonProps={{ onClick: () => window.open(research.pdf, '_blank'), style: { background: '#5b8af5', color: 'var(--foreground)', border: 'none' } }}
          imageUrl={research.image}
          imageAlt={research.imageAlt}
          onImageClick={() => openLb(research.image, '4-Pillars AI Failure Taxonomy')}
          style={{ border: 'none', background: 'transparent' }}
        />
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {research.metrics.map((m) => (
            <div key={m.label} style={{ padding: '24px', background: `color-mix(in srgb, ${m.color} 3%, transparent)`, border: `1px solid color-mix(in srgb, ${m.color} 20%, transparent)`, borderRadius: 8 }}>
              <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 400, color: 'var(--foreground)', lineHeight: 1, paddingBottom: '0.05em' }}>{m.metric}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: FG3, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="two-col-pillars">
          {research.pillars.map(p => (
            <div key={p.n} style={{ padding: '18px 22px', border: `1px solid color-mix(in srgb, ${p.color} 13%, transparent)`, background: `color-mix(in srgb, ${p.color} 2%, transparent)`, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: p.color, opacity: 0.7 }}>{p.n}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: p.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{p.label}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: FG2 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:640px){.two-col-pillars{grid-template-columns:1fr!important}}`}</style>
      </div>
    </Section>
  );
}

