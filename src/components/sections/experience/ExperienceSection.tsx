'use client';

import React, { useState } from 'react';
import { Section, SH, Tag, useReveal, pickColor, MONO, SERIF, FG2 } from '@/components/shared/section-helpers';
import { jobs } from '@/lib/data/jobs';
import { sectionById } from '@/lib/data/sections';

export function ExperienceSection() {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, visible } = useReveal();
  const def = sectionById('timeline')!;
  return (
    <Section id="timeline" style={{ background: 'rgba(17,19,26,0.82)' }}>
      <SH n={def.n} label="Experience" sub="Where the work actually happened." color={def.color} />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.map((job, i) => (
          <div
            key={job.id}
            role="button"
            tabIndex={0}
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(open === i ? null : i);
              }
            }}
            style={{
              cursor: 'pointer',
              background: open === i ? `color-mix(in oklch, ${job.color} 7%, transparent)` : `color-mix(in oklch, ${job.color} 3%, transparent)`,
              backdropFilter: 'blur(10px) saturate(1.15)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.15)',
              border: `1px solid color-mix(in srgb, ${job.color} ${open === i ? '38%' : '19%'}, transparent)`,
              transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
              borderRadius: 10,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(to bottom, ${job.color}, color-mix(in srgb, ${job.color} 44%, transparent))`, borderRadius: '10px 0 0 10px' }} />

            <div style={{ padding: '20px 24px 20px 30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {job.active && <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, display: 'inline-block', flexShrink: 0 }} />}
                    <span style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', background: `color-mix(in srgb, ${job.color} 9%, transparent)`, padding: '2px 9px', borderRadius: 3 }}>{job.type}</span>
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 400, color: 'var(--foreground)', letterSpacing: '-0.01em', lineHeight: 1.25, paddingBottom: '0.05em' }}>{job.role}</div>
                  <div style={{ fontSize: 13, color: FG2, marginTop: 4 }}>{job.company} · {job.location}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {job.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={job.logo} alt={`${job.company} logo`} style={{ height: 50, maxWidth: 150, objectFit: 'contain', objectPosition: 'right center', opacity: 0.95 }} />
                  )}
                  <div style={{ fontFamily: MONO, fontSize: 11, color: job.color, letterSpacing: '0.06em' }}>{job.period}</div>
                  <span style={{ fontSize: 18, color: job.color, display: 'inline-block', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
              </div>

              {open !== i && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {job.achievements.slice(0, 2).map((a, ai) => { const ac = pickColor(a); return (
                    <span key={ai} style={{ fontFamily: MONO, fontSize: 10, padding: '3px 8px', background: `${ac}12`, border: `1px solid ${ac}30`, borderRadius: 3, color: ac, letterSpacing: '0.02em' }}>{a}</span>
                  ); })}
                </div>
              )}

              {open === i && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid color-mix(in srgb, ${job.color} 13%, transparent)` }} onClick={e => e.stopPropagation()}>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: FG2, marginBottom: 18 }}>{job.description}</p>

                  <div style={{ fontFamily: MONO, fontSize: 10, color: job.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.8 }}>Key Achievements</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8, marginBottom: 18 }}>
                    {job.achievements.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: `color-mix(in srgb, ${job.color} 4%, transparent)`, borderRadius: 6, border: `1px solid color-mix(in srgb, ${job.color} 13%, transparent)` }}>
                        <span style={{ color: job.color, fontSize: 10, marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.45 }}>{a}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {job.stack.map(s => <Tag key={s}>{s}</Tag>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
