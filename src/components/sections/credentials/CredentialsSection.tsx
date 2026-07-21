'use client';

import React from 'react';
import { Section, SH, useReveal, MONO, SANS, FG3 } from '@/components/shared/section-helpers';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { Pic } from '@/components/ui/pic';
import { awards } from '@/lib/data/awards';
import { affiliations } from '@/lib/data/affiliations';
import { certs } from '@/lib/data/certs';
import { sectionById } from '@/lib/data/sections';
import { CertFlipCard } from './CertFlipCard';
import { LearningMarquee } from './LearningMarquee';

/**
 * Credentials wall: certifications, awards & recognition, and professional
 * affiliations (content unchanged from the original Skills section; the
 * cinematic badge treatment lands in Phase 5).
 */
export function CredentialsSection() {
  const { ref, visible } = useReveal();
  const [openAward, setOpenAward] = React.useState<number | null>(null);
  const [openAffil, setOpenAffil] = React.useState<number | null>(null);
  const openLb = useLightboxOpen();
  const def = sectionById('credentials')!;
  return (
    <Section id="credentials" style={{ background: 'rgba(15,17,23,0.86)' }}>
      <SH n={def.n} label="Credentials" sub="Certifications, awards, and the communities behind the work." color={def.color} />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
        {/* Certifications — 3D flip badges */}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Certifications · hover or tap to flip</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="cert-flip-grid">
            {certs.map((cert) => (
              <CertFlipCard key={cert.id} cert={cert} />
            ))}
          </div>
          <LearningMarquee />
        </div>

        {/* Awards */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Awards & Recognition</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {awards.map((a, i) => (
              <div key={i}
                role="button"
                tabIndex={0}
                aria-expanded={openAward === i}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenAward(openAward === i ? null : i); } }}
                onClick={() => setOpenAward(openAward === i ? null : i)}
                style={{ background: openAward === i ? `${a.color}10` : `${a.color}07`, borderTop: `2px solid ${a.color}`, borderRight: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderBottom: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderLeft: `1px solid ${openAward === i ? a.color + '55' : a.color + '25'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{a.title}{a.milestone && <span style={{ color: 'var(--gold)', marginLeft: 7 }} aria-label="milestone">✦</span>}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{a.detail}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: a.color }}>{a.date}</span>
                    <span style={{ fontSize: 14, color: FG3, transition: 'transform 0.3s', transform: openAward === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </div>
                </div>
                {openAward === i && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--bd)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.images.length}, 1fr)`, gap: 8, marginTop: 14 }}>
                      {a.images.map((src, j) => (
                        <div key={j} style={{ width: '100%', aspectRatio: a.ratio ?? '16/9', background: 'var(--background)', borderRadius: 6, overflow: 'hidden' }}>
                          <Pic src={src} alt={a.title} onClick={e => { e.stopPropagation(); openLb(src, a.title); }} style={{ width: '100%', height: '100%', objectFit: a.imgFit, objectPosition: a.imgPos ?? 'center', display: 'block', cursor: 'zoom-in' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Affiliations */}
        <div style={{ marginTop: 52 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Professional Affiliations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, alignItems: 'start' }} className="two-col-awards">
            {affiliations.map((a, i) => (
              <div key={i}
                role="button"
                tabIndex={0}
                aria-expanded={openAffil === i}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenAffil(openAffil === i ? null : i); } }}
                onClick={() => setOpenAffil(openAffil === i ? null : i)}
                style={{ background: openAffil === i ? `${a.color}10` : `${a.color}07`, border: `1px solid ${openAffil === i ? a.color + '55' : a.color + '25'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden' }}>
                <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `${a.color}15`, border: `1px solid ${a.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: a.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }}>{a.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: a.color, marginTop: 3 }}>{a.role}</div>
                    <div style={{ fontSize: 12, color: FG3, marginTop: 3, lineHeight: 1.4 }}>{a.short}</div>
                  </div>
                  <span style={{ fontSize: 16, color: FG3, transition: 'transform 0.3s', transform: openAffil === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginTop: 2 }}>+</span>
                </div>
                {openAffil === i && (
                  <div style={{ padding: '0 22px 22px', borderTop: '1px solid var(--bd)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.images.length}, 1fr)`, gap: 8, marginTop: 14 }}>
                      {a.images.map((src, j) => (
                        <div key={j} style={{ width: '100%', aspectRatio: a.ratio ?? '16/9', background: 'var(--background)', borderRadius: 6, overflow: 'hidden' }}>
                          <Pic src={src} alt={a.name} onClick={e => { e.stopPropagation(); openLb(src, a.name); }} style={{ width: '100%', height: '100%', objectFit: a.imgFit, objectPosition: a.imgPos ?? 'center', display: 'block', cursor: 'zoom-in' }} />
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text2)', marginTop: 14 }}>{a.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.cert-flip-grid{grid-template-columns:1fr!important}}@media(max-width:860px){.two-col-awards{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}
