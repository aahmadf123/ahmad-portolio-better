'use client';

import React from 'react';
import Link from 'next/link';
import type { Insight } from '@/lib/data/insights';

export type TokenLine = { content: string; color: string }[];

/**
 * Terminal-chrome insight card. When scrolled into view the pre-tokenized
 * lines reveal one by one with a background sweep; a cursor blinks at the end.
 */
export function CodeCard({ insight, lines, wide }: { insight: Insight; lines: TokenLine[]; wide?: boolean }) {
  return (
    <article data-insight={insight.id} className={wide ? 'cc insight-wide' : 'cc'} style={{ gridColumn: wide ? 'span 2' : undefined, '--area': insight.color } as React.CSSProperties}>
      <div className="cc-bar">
        <span className="cc-file"><i aria-hidden className="cc-dots"><b /><b /><b /></i>{insight.file}</span>
        <span className="cc-flag">illustrative</span>
      </div>
      <div tabIndex={0} role="region" aria-label={`Code: ${insight.file}`} className="cc-code">
        {lines.map((line, li) => (
          <div key={li} style={{ whiteSpace: 'pre', minHeight: 19 }}>
            {line.length === 0 ? ' ' : line.map((t, ti) => <span key={ti} style={{ color: t.color.startsWith('#758575') ? '#a3a294' : t.color }}>{t.content}</span>)}
          </div>
        ))}
      </div>
      <div className="cc-foot">
        <h4 className="cc-title">{insight.title}</h4>
        <p className="cc-take">{insight.takeaway}</p>
        <Link href={insight.source.href} transitionTypes={['nav-forward']} className="text-link is-underlined cc-src">From: {insight.source.label} →</Link>
      </div>
      <style>{`
        .cc { min-width: 0; border: 1px solid color-mix(in srgb, var(--area) 45%, #2c2f36); border-radius: 6px; overflow: hidden; background: #16171a; }
        :root[data-theme="dark"] .cc { background: #1b1d22; }
        .cc-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 14px; background: color-mix(in srgb, var(--area) 16%, #1f2126); color: #c9c7bd; font-size: 13px; border-bottom: 1px solid color-mix(in srgb, var(--area) 35%, #2c2f36); }
        .cc-file { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-code), monospace; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #e6e3d8; }
        .cc-dots { display: inline-flex; gap: 5px; }
        .cc-dots b { width: 8px; height: 8px; border-radius: 50%; background: var(--area); opacity: .9; }
        .cc-dots b + b { opacity: .55; }
        .cc-dots b + b + b { opacity: .3; }
        .cc-flag { flex-shrink: 0; padding: 2px 8px; border-radius: 3px; border: 1px solid #4a4e58; color: #c9c7bd; font-size: 12px; }
        .cc-code { background: transparent; color: #dbd7ca; padding: 18px 20px; overflow-x: auto; font-family: var(--font-code), monospace; font-size: 13.5px; line-height: 1.75; }
        .cc-foot { padding: 16px 20px 18px; background: var(--background); border-top: 1px solid color-mix(in srgb, var(--area) 35%, #2c2f36); }
        .cc-title { font-size: 17px; font-weight: 500; color: color-mix(in oklab, var(--area) var(--accent-mix), var(--foreground)); }
        .cc-take { margin-top: 6px; font-size: 15px; color: var(--text2); }
        .cc-src { margin-top: 10px; font-size: 14px; }
      `}</style>
    </article>
  );
}

