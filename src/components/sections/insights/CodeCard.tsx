'use client';

import React from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/lib/motion/use-reduced-motion';
import { MONO, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import type { Insight } from '@/lib/data/insights';

export type TokenLine = { content: string; color: string }[];

/**
 * Terminal-chrome insight card. When scrolled into view the pre-tokenized
 * lines reveal one by one with a background sweep; a cursor blinks at the end.
 */
export function CodeCard({ insight, lines, wide }: { insight: Insight; lines: TokenLine[]; wide?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <article
      data-insight={insight.id}
      style={{
        gridColumn: wide ? 'span 2' : undefined,
        border: `1px solid color-mix(in srgb, ${insight.color} 24%, transparent)`,
        borderRadius: 10,
        background: 'var(--surface)',
        overflow: 'hidden',
        minWidth: 0,
      }}
      className={wide ? 'rv insight-wide' : 'rv'}
    >
      {/* terminal chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--bd)', background: 'rgba(244,244,242,0.02)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(239,68,68,0.5)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(245,158,11,0.5)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(34,197,94,0.5)' }} />
        <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.05em', marginLeft: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{insight.file}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: 'auto', border: '1px solid var(--bd2)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>illustrative</span>
      </div>

      {/* code */}
      <div
        tabIndex={0}
        role="region"
        aria-label={`Code: ${insight.file}`}
        style={{ padding: '16px 18px', overflowX: 'auto', fontFamily: MONO, fontSize: 12.5, lineHeight: 1.75 }}
      >
        {lines.map((line, li) => (
          <div key={li} style={{ whiteSpace: 'pre', minHeight: 19 }}>
            {line.length === 0 ? ' ' : line.map((t, ti) => (
              <span key={ti} style={{ color: t.color }}>{t.content}</span>
            ))}
          </div>
        ))}
        {!reduced && (
          <span aria-hidden style={{ display: 'inline-block', width: 7, height: 14, background: insight.color, opacity: 0.7, animation: 'insight-caret 1s step-end infinite', verticalAlign: 'text-bottom' }} />
        )}
      </div>

      {/* takeaway */}
      <div style={{ padding: '16px 18px 18px', borderTop: '1px solid var(--bd)' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: insight.color, marginBottom: 7 }}>{insight.title}</div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.7, color: FG2, margin: 0 }}>{insight.takeaway}</p>
        <Link href={insight.source.href} transitionTypes={['nav-forward']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          From: {insight.source.label} ↗
        </Link>
      </div>

      <style>{`@keyframes insight-caret { 0%,100% { opacity: 0.7; } 50% { opacity: 0; } }`}</style>
    </article>
  );
}

