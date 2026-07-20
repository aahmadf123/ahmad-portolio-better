'use client';

import React from 'react';
import { Section, SH, Tag, useReveal, MONO, SERIF, FG2, FG3 } from '@/components/shared/section-helpers';
import { HoverPeek } from '@/components/ui/link-preview';
import { about } from '@/lib/data/about';
import { education } from '@/lib/data/education';
import { site } from '@/lib/data/site';
import { sectionById } from '@/lib/data/sections';

export function AboutSection() {
  const { ref, visible } = useReveal();
  const def = sectionById('about')!;
  return (
    <Section id="about">
      <SH n={def.n} label="About" color={def.color} />
      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--foreground)', paddingBottom: '0.08em' }}>
            {about.headline}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: FG2, marginTop: 24 }}>{about.bio}</p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HoverPeek url={site.socials.linkedin}>
              <a href={site.socials.linkedin} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid var(--bd2)', color: FG2, borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LinkedIn ↗</a>
            </HoverPeek>
            <HoverPeek url={site.socials.github}>
              <a href={site.socials.github} target="_blank" rel="noopener" style={{ fontFamily: MONO, fontSize: 11, padding: '10px 20px', border: '1px solid var(--bd2)', color: FG2, borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>GitHub ↗</a>
            </HoverPeek>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: FG3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Three things I believe</div>
          {about.beliefs.map((item) => (
            <div key={item.n} style={{ padding: '18px 20px', border: '1px solid var(--bd)', background: `color-mix(in srgb, ${item.color} 5%, transparent)`, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: item.color, opacity: 0.7 }}>{item.n}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{item.title}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: FG2 }}>{item.body}</p>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '20px', background: 'rgba(244,244,242,0.025)', borderRadius: 8, border: '1px solid var(--bd)' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--purple)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Education</div>
            <div style={{ fontSize: 20, fontWeight: 400, color: 'var(--foreground)', fontFamily: SERIF, paddingBottom: '0.05em' }}>{education.school}</div>
            <div style={{ fontSize: 14, color: FG2, marginTop: 3 }}>{education.degree}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--gold)', marginTop: 8 }}>{education.period} · {education.status} · GPA {education.gpa}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
              {education.coursework.map(c => <Tag key={c}>{c}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
