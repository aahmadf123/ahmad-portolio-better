import React from 'react';
import { MONO, SERIF, SANS } from '@/components/shared/section-helpers';

/**
 * The words over a world's photo: chapter mark, title, the story sentences for this
 * world, and its one stat (accent rule on top, display-serif number, mono label).
 */
export function ChapterCopy({
  mark, title, titleId, paragraphs, stat, accent, testId,
}: {
  mark: string;
  title: string;
  titleId: string;
  paragraphs: string[];
  stat: { value: string; label: string };
  /** Hex. */
  accent: string;
  testId: string;
}) {
  return (
    <div data-testid={testId} className="chapter-copy">
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>{mark}</div>
      <h2 id={titleId} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--text-3xl)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: '12px 0 16px' }}>{title}</h2>
      {paragraphs.map((t) => (
        <p key={t.slice(0, 24)} style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.65, color: 'var(--foreground)', margin: '0 0 10px', maxWidth: 560 }}>{t}</p>
      ))}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `2px solid ${accent}`, display: 'inline-block' }}>
        <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1, color: 'var(--foreground)' }}>{stat.value}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', marginTop: 6 }}>{stat.label}</div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .chapter-copy p { font-size: 15px !important; line-height: 1.5 !important; }
        }
        @media (max-height: 760px) {
          .chapter-copy p { font-size: 15px !important; line-height: 1.5 !important; }
          .chapter-copy h2 { margin: 8px 0 10px !important; }
        }
      `}</style>
    </div>
  );
}
