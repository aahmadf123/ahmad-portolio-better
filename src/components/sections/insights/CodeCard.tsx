'use client';

import React from 'react';
import Link from 'next/link';
import { m, useReducedMotion } from 'framer-motion';
import { Section, SH, MONO, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import type { Insight } from '@/lib/data/insights';
import type { SectionDef } from '@/lib/data/sections';

export type TokenLine = { content: string; color: string }[];

export function InsightsGrid({ def, cards }: { def: SectionDef; cards: { insight: Insight; lines: TokenLine[] }[] }) {
  return (
    <Section id="insights" style={{ background: 'rgba(15,17,23,0.9)' }}>
      <SH n={def.n} label="Technical Insights" sub="Not tutorials, but perspective. The mechanisms behind the work are sketched in code and traced back to the project that taught them." color={def.color} />
      <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {cards.map(({ insight, lines }, i) => (
          <CodeCard key={insight.id} insight={insight} lines={lines} wide={i === 0} />
        ))}
      </div>
      <style>{`
        @media (max-width: 860px) { .insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </Section>
  );
}

/**
 * Terminal-chrome insight card. When scrolled into view the pre-tokenized
 * lines reveal one by one with a background sweep; a cursor blinks at the end.
 */
export function CodeCard({ insight, lines, wide }: { insight: Insight; lines: TokenLine[]; wide?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <m.article
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        gridColumn: wide ? 'span 2' : undefined,
        border: `1px solid color-mix(in srgb, ${insight.color} 24%, transparent)`,
        borderRadius: 12,
        background: 'var(--surface)',
        overflow: 'hidden',
        minWidth: 0,
      }}
      className={wide ? 'insight-wide' : undefined}
    >
      {/* terminal chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--bd)', background: 'rgba(244,244,242,0.02)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(239,68,68,0.5)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(245,158,11,0.5)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(34,197,94,0.5)' }} />
        <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.05em', marginLeft: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{insight.file}</span>
        <span style={{ fontFamily: MONO, fontSize: 8, color: FG3, letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 'auto', border: '1px solid var(--bd2)', borderRadius: 3, padding: '2px 6px', flexShrink: 0 }}>illustrative</span>
      </div>

      {/* code */}
      <m.div
        initial={reduced ? 'shown' : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: reduced ? 0 : 0.07 }}
        style={{ padding: '16px 18px', overflowX: 'auto', fontFamily: MONO, fontSize: 12.5, lineHeight: 1.75 }}
      >
        {lines.map((line, li) => (
          <m.div
            key={li}
            variants={{
              hidden: { opacity: 0, backgroundColor: 'rgba(45,212,191,0.0)' },
              shown: { opacity: 1, backgroundColor: ['rgba(45,212,191,0.14)', 'rgba(45,212,191,0.0)'] },
            }}
            transition={{ duration: reduced ? 0 : 0.5 }}
            style={{ whiteSpace: 'pre', minHeight: 19 }}
          >
            {line.length === 0 ? ' ' : line.map((t, ti) => (
              <span key={ti} style={{ color: t.color }}>{t.content}</span>
            ))}
          </m.div>
        ))}
        {!reduced && (
          <span aria-hidden style={{ display: 'inline-block', width: 7, height: 14, background: insight.color, opacity: 0.7, animation: 'insight-caret 1s step-end infinite', verticalAlign: 'text-bottom' }} />
        )}
      </m.div>

      {/* takeaway */}
      <div style={{ padding: '16px 18px 18px', borderTop: '1px solid var(--bd)' }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: insight.color, marginBottom: 7 }}>{insight.title}</div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.7, color: FG2, margin: 0 }}>{insight.takeaway}</p>
        <Link href={insight.source.href} transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          From: {insight.source.label} ↗
        </Link>
      </div>

      <style>{`@keyframes insight-caret { 0%,100% { opacity: 0.7; } 50% { opacity: 0; } }`}</style>
    </m.article>
  );
}
