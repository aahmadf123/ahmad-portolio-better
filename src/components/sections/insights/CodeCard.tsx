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
    <article data-insight={insight.id} className={wide ? 'cc insight-wide' : 'cc'} style={{ gridColumn: wide ? 'span 2' : undefined }}>
      <div className="cc-bar">
        <span className="cc-file">{insight.file}</span>
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
        .cc { min-width: 0; }
        .cc-bar { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; color: var(--text3); padding-bottom: 8px; }
        .cc-file { font-family: var(--font-code), monospace; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        /* Code stays on its own dark panel in both themes (the highlighter's palette is dark). */
        .cc-code { background: #16171a; color: #dbd7ca; border-radius: 3px; padding: 16px 18px; overflow-x: auto; font-family: var(--font-code), monospace; font-size: 13px; line-height: 1.75; }
        .cc-foot { padding-top: 14px; }
        .cc-title { font-size: 17px; font-weight: 500; }
        .cc-take { margin-top: 6px; font-size: 15px; color: var(--text2); }
        .cc-src { margin-top: 10px; font-size: 14px; }
      `}</style>
    </article>
  );
}

