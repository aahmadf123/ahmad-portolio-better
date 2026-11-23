import React from 'react';
import Link from 'next/link';
import { fieldNotes } from '@/lib/field-notes';
import { Pic } from '@/components/ui/pic';

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/**
 * Field Notes on the homepage: a dated list, newest first. The newest note carries its
 * excerpt; the rest are titles. Only published essays are listed.
 */
export function FieldNotesSection() {
  const published = fieldNotes
    .filter((n) => n.published && n.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section id="field-notes" aria-labelledby="field-notes-title" className="fn">
      <div className="wrap">
        <div className="fn-head rv">
          <h2 id="field-notes-title" className="fn-title draw-rule">Field notes</h2>
          <p className="fn-lede">Thinking in public: dispatches from the edge of AI, robotics, and real-world systems.</p>
          <Link href="/field-notes" transitionTypes={['nav-forward']} className="text-link is-underlined fn-all">All Notes ↗</Link>
        </div>
        <ol className="fn-list">
          {published.map((n, i) => (
            <li key={n.slug} className="rv" style={{ '--i': i } as React.CSSProperties}>
              <Link href={`/field-notes/${n.slug}`} transitionTypes={['nav-forward']} className="fn-row">
                <span className="fn-date tnum">{fmt(n.date)}</span>
                <span>
                  <span className="fn-name">{n.title}</span>
                  {i === 0 && <span className="fn-excerpt">{n.excerpt}</span>}
                  {i === 0 && <span className="fn-tags">{n.tags.join(' · ')}</span>}
                  {i === 0 && <span className="fn-read">Read the essay →</span>}
                  {i === 0 && n.heroImage && <span className="fn-img lift-img"><Pic src={n.heroImage} alt="" sizes="(max-width: 860px) 92vw, 560px" /></span>}
                </span>
                <span className="fn-meta">{n.category} · {n.readingTime} min read</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .fn { padding: clamp(64px, 10vw, 140px) 0; }
        .fn-head { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 16px 40px; align-items: end; margin-bottom: 32px; }
        .fn-title { font-size: clamp(40px, 5vw, 72px); font-weight: 400; letter-spacing: -0.03em; line-height: 1; }
        .fn-lede { color: var(--text2); max-width: 32em; font-size: 18px; }
        .fn-all { grid-column: 2; justify-self: start; font-size: 15px; }
        .fn-list { list-style: none; border-top: 1px solid var(--foreground); }
        .fn-list li { border-bottom: 1px solid var(--bd); }
        .fn-row { transition: background-color .3s, padding .3s; border-radius: 3px; display: grid; grid-template-columns: 11em minmax(0, 1fr) 15em; gap: 8px 28px; padding: 22px 0; align-items: baseline; }
        .fn-date, .fn-meta { font-size: 14px; color: var(--text3); }
        .fn-meta { text-align: right; }
        .fn-name { font-size: clamp(19px, 1.6vw, 23px); line-height: 1.25; letter-spacing: -0.015em; }
        .fn-row:is(:hover, :focus-visible) { background: var(--surface); padding-left: 14px; padding-right: 14px; }
        .fn-row:is(:hover, :focus-visible) .fn-name { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
        .fn-excerpt { display: block; margin-top: 8px; font-size: 16px; color: var(--text2); max-width: 40em; }
        .fn-tags { display: block; margin-top: 10px; font-size: 14px; color: var(--text3); }
        .fn-read { display: inline-block; margin-top: 12px; font-size: 15px; border-bottom: 1px solid var(--bd2); }
        .fn-img { display: block; margin-top: 20px; max-width: 560px; border-radius: 3px; overflow: hidden; background: var(--surface); }
        .fn-img img { display: block; width: 100%; height: auto; }
        @media (max-width: 860px) {
          .fn-head { grid-template-columns: minmax(0, 1fr); }
          .fn-all { grid-column: 1; }
          .fn-row { grid-template-columns: minmax(0, 1fr); }
          .fn-meta { text-align: left; }
        }
      `}</style>
    </section>
  );
}
