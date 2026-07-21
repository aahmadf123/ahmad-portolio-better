'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { Section, SH, Tag, MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { MetricsBand } from '@/components/shared/MetricsBand';
import { HoverPeek } from '@/components/ui/link-preview';
import { about, type Lens } from '@/lib/data/about';
import { education } from '@/lib/data/education';
import { site } from '@/lib/data/site';
import { sectionById } from '@/lib/data/sections';
import { SignOff } from './SignOff';

/**
 * Immersive About journey: intro manifesto, then three lenses
 * (Engineer · Builder · Thinker) with a sticky active-lens rail on desktop.
 * All original copy (headline, bio, beliefs, education) is preserved inside
 * the lens structure.
 */
export function AboutSection() {
  const def = sectionById('about')!;
  const [active, setActive] = useState<Lens['id']>('engineer');
  const activeLens = about.lenses.find((l) => l.id === active)!;

  return (
    <Section id="about" style={{ background: 'rgba(15,17,23,0.86)' }}>
      <SH n={def.n} label="About" sub="Beyond the résumé — who is actually doing the work." color={def.color} />

      <MetricsBand />

      {/* manifesto intro */}
      <div style={{ maxWidth: 780, marginBottom: 'clamp(36px, 5vw, 64px)' }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(26px, 3.2vw, 44px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--foreground)', paddingBottom: '0.08em' }}>
          {about.headline}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.78, color: FG2, marginTop: 18, maxWidth: 640 }}>{about.bio}</p>
        <div style={{ marginTop: 22, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HoverPeek url={site.socials.linkedin}>
            <a href={site.socials.linkedin} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid var(--bd2)', color: FG2, borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LinkedIn ↗</a>
          </HoverPeek>
          <HoverPeek url={site.socials.github}>
            <a href={site.socials.github} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid var(--bd2)', color: FG2, borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub ↗</a>
          </HoverPeek>
        </div>
      </div>

      {/* lenses */}
      <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 34fr) minmax(0, 66fr)', gap: 'clamp(24px, 4vw, 72px)', alignItems: 'start' }}>
        {/* sticky rail */}
        <div className="about-rail" style={{ position: 'sticky', top: 110 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: FG3, marginBottom: 14 }}>Three lenses</div>
          <div style={{ position: 'relative', minHeight: 96 }}>
            <AnimatePresence mode="wait">
              <m.div
                key={activeLens.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <span style={{ fontFamily: MONO, fontSize: 11, color: def.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{activeLens.kicker}</span>
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(40px, 4.5vw, 68px)', lineHeight: 1, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                  {activeLens.title}
                </div>
              </m.div>
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 22 }}>
            {about.lenses.map((l) => (
              <button
                key={l.id}
                onClick={() => document.getElementById(`lens-${l.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: active === l.id ? def.color : FG3, padding: 0, transition: 'color 0.2s',
                }}
              >
                <span style={{ width: active === l.id ? 22 : 12, height: 1.5, background: active === l.id ? def.color : 'var(--bd2)', transition: 'all 0.25s' }} />
                {l.title}
              </button>
            ))}
          </div>
        </div>

        {/* panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 56px)' }}>
          {about.lenses.map((lens) => (
            <LensPanel key={lens.id} lens={lens} accent={def.color} onActive={() => setActive(lens.id)} />
          ))}
        </div>
      </div>

      <SignOff text={about.signOff.text} sub={about.signOff.sub} />

      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-rail { position: relative !important; top: 0 !important; }
        }
      `}</style>
    </Section>
  );
}

function LensPanel({ lens, accent, onActive }: { lens: Lens; accent: string; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5 });
  React.useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  const beliefs = about.beliefs.filter((b) => lens.beliefIds.includes(b.n));

  return (
    <m.article
      id={`lens-${lens.id}`}
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: '1px solid var(--bd)',
        borderRadius: 12,
        padding: 'clamp(22px, 3vw, 34px)',
        background: 'rgba(244,244,242,0.02)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 50% at 85% 0%, color-mix(in srgb, ${accent} 6%, transparent), transparent 70%)` }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{lens.kicker} · {lens.title}</div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(21px, 2.2vw, 30px)', lineHeight: 1.2, letterSpacing: '-0.015em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.05em' }}>
          {lens.lead}
        </h3>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: FG2, marginTop: 14 }}>{lens.body}</p>

        {/* data point */}
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, marginTop: 18, padding: '10px 16px', border: `1px solid color-mix(in srgb, ${accent} 24%, transparent)`, borderRadius: 6, background: `color-mix(in srgb, ${accent} 4%, transparent)` }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: FG3 }}>{lens.dataPoint.label}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: accent, letterSpacing: '0.02em' }}>{lens.dataPoint.value}</span>
        </div>

        {/* beliefs embedded in the lens */}
        {beliefs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 8, marginTop: 18 }}>
            {beliefs.map((b) => (
              <div key={b.n} style={{ padding: '14px 16px', border: '1px solid var(--bd)', background: `color-mix(in srgb, ${b.color} 4%, transparent)`, borderRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: b.color, opacity: 0.7 }}>{b.n}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{b.title}</span>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, color: FG2 }}>{b.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* education card lives in the Engineer lens */}
        {lens.id === 'engineer' && (
          <div style={{ marginTop: 18, padding: '18px 20px', background: 'rgba(244,244,242,0.025)', borderRadius: 8, border: '1px solid var(--bd)' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--purple)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
            <div style={{ fontSize: 19, fontWeight: 400, color: 'var(--foreground)', fontFamily: SERIF, paddingBottom: '0.05em' }}>{education.school}</div>
            <div style={{ fontSize: 13, color: FG2, marginTop: 2 }}>{education.degree}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--gold)', marginTop: 6 }}>{education.period} · {education.status} · GPA {education.gpa}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
              {education.coursework.map((c) => <Tag key={c}>{c}</Tag>)}
            </div>
          </div>
        )}

        {/* artifacts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
          {lens.artifacts.map((a) =>
            a.external ? (
              <a key={a.href} href={a.href} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 10, padding: '7px 14px', border: '1px solid var(--bd2)', borderRadius: 5, color: FG2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {a.label} ↗
              </a>
            ) : a.href.startsWith('#') ? (
              <a key={a.href} href={a.href} style={{ fontFamily: MONO, fontSize: 10, padding: '7px 14px', border: '1px solid var(--bd2)', borderRadius: 5, color: FG2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {a.label} ↓
              </a>
            ) : (
              <Link key={a.href} href={a.href} transitionTypes={['nav-forward']} style={{ fontFamily: MONO, fontSize: 10, padding: '7px 14px', border: '1px solid var(--bd2)', borderRadius: 5, color: FG2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {a.label} ↗
              </Link>
            )
          )}
        </div>
      </div>
    </m.article>
  );
}
