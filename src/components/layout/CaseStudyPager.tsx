'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { projects } from '@/lib/data/projects';

const MONO = 'var(--font-body), system-ui, sans-serif';
const SERIF = 'var(--font-body), system-ui, sans-serif';

const studies = projects.filter((p) => p.slug);

/**
 * Previous / next case study, in the same order as the Projects section.
 * Case studies used to be dead ends: the only way on was back to the homepage.
 */
export function CaseStudyPager() {
  const pathname = usePathname();
  const i = studies.findIndex((p) => pathname === `/case-study/${p.slug}`);
  if (i < 0) return null;
  const prev = studies[(i - 1 + studies.length) % studies.length];
  const next = studies[(i + 1) % studies.length];

  const card = (p: (typeof studies)[number], dir: 'prev' | 'next') => (
    <Link
      href={`/case-study/${p.slug}`}
      transitionTypes={[dir === 'next' ? 'nav-forward' : 'nav-back']}
      style={{
        display: 'block', padding: '18px 20px', borderRadius: 10, textDecoration: 'none',
        border: `1px solid color-mix(in srgb, ${p.color} 28%, transparent)`,
        background: `color-mix(in srgb, ${p.color} 5%, transparent)`,
        textAlign: dir === 'next' ? 'right' : 'left',
      }}
    >
      <span style={{ display: 'block', fontFamily: MONO, fontSize: 13, letterSpacing: 0, color: 'var(--text3)', marginBottom: 6 }}>
        {dir === 'next' ? 'Next case study →' : '← Previous case study'}
      </span>
      <span style={{ display: 'block', fontFamily: SERIF, fontSize: 22, lineHeight: 1.2, color: 'var(--foreground)' }}>{p.title}</span>
    </Link>
  );

  return (
    <nav aria-label="More case studies" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) clamp(56px, 7vw, 88px)' }}>
      {/* Dossier motif, same numbering voice as the homepage chapters. */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
        <span aria-hidden style={{ fontFamily: SERIF, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1, color: studies[i].color, opacity: 0.35 }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 0, color: 'var(--text3)' }}>
          Case file {String(i + 1).padStart(2, '0')} of {String(studies.length).padStart(2, '0')}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 12 }}>
        {card(prev, 'prev')}
        {card(next, 'next')}
      </div>
    </nav>
  );
}
