'use client';

import React from 'react';
import { Section, useReveal, MONO, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { nowCards, nowUpdated } from '@/lib/data/now';

export function NowSection() {
  const { ref, visible } = useReveal();

  return (
    <Section id="now" style={{ background: 'rgba(17,19,26,0.82)' }}>
      <div style={{ marginBottom: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: 'var(--primary)', opacity: 0.6, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)' }}>Now</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Updated · {nowUpdated}</span>
        </div>
        <p style={{ fontSize: 15, color: FG2, maxWidth: 460, lineHeight: 1.65, fontFamily: SANS }}>
          What I&apos;m actively learning, building, and chasing outside of work.
        </p>
      </div>

      <div ref={ref} className={`reveal ${visible ? 'in' : ''} now-grid`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {nowCards.map((card) => (
          <div key={card.category} style={{
            background: 'color-mix(in oklch, var(--foreground) 2%, transparent)',
            backdropFilter: 'blur(12px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.12)',
            border: `1px solid ${card.color}44`,
            borderRadius: 10,
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: card.color, fontSize: 13, opacity: 0.85 }}>{card.icon}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color }}>
                  {card.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: card.statusColor, display: 'inline-block', flexShrink: 0 }} className={card.status === 'Active' || card.status === 'In Progress' ? 'pulse' : ''} />
                <span style={{ fontFamily: MONO, fontSize: 10, color: card.statusColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{card.status}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {card.items.map((item) => (
                <div key={item.title}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: FG3, marginTop: 3 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:860px){#now .reveal{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:560px){#now .reveal{grid-template-columns:1fr!important}}`}</style>
    </Section>
  );
}
