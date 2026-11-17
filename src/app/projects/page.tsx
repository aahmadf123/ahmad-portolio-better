import React from 'react';
import type { Metadata } from 'next';
import { SubpageHeader } from '@/components/layout/SubpageHeader';
import { PhotoBackdrop } from '@/components/journey/PhotoBackdrop';
import { ProjectsGrid } from '@/components/sections/projects/ProjectsGrid';
import { projects } from '@/lib/data/projects';

const DESCRIPTION = 'Every project in one place: AI engineering, research, sports analytics, data science and the Chem-E Car. Open any one for its full case study.';

export const metadata: Metadata = {
  title: 'Projects',
  description: DESCRIPTION,
  alternates: { canonical: 'https://ahmadfx.xyz/projects' },
  openGraph: {
    type: 'website',
    url: 'https://ahmadfx.xyz/projects',
    title: 'Projects · Ahmad Firas',
    description: DESCRIPTION,
    images: [{ url: '/Images/optimized/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Projects · Ahmad Firas', description: DESCRIPTION, images: ['/Images/optimized/og.png'] },
};

const SERIF = 'var(--font-display), Georgia, serif';
const MONO = 'var(--font-code), monospace';

/**
 * All projects on one page (the homepage spreads them across the journey's worlds):
 * a centred header, then one ordered, filterable grid. Every tile opens its case study.
 */
export default function ProjectsPage() {
  return (
    <div style={{ background: 'transparent', position: 'relative', isolation: 'isolate', color: 'var(--foreground)', minHeight: '100vh' }}>
      <PhotoBackdrop id="opening" />
      <SubpageHeader backHref="/" backLabel="Portfolio" restoreScroll />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,52px) 96px' }}>
        <header style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(32px, 5vw, 52px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <span aria-hidden style={{ width: 28, height: 1.5, background: 'linear-gradient(90deg, var(--primary), var(--gold))', opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>
              Projects · {projects.length}
            </span>
            <span aria-hidden style={{ width: 28, height: 1.5, background: 'linear-gradient(90deg, var(--gold), var(--primary))', opacity: 0.8 }} />
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--text-3xl)', lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 20px', paddingBottom: '0.04em' }}>
            Everything I&apos;ve built,<br />
            <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>in one place.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 17, lineHeight: 1.75, color: 'var(--text2)', margin: 0 }}>
            {DESCRIPTION}
          </p>
        </header>

        <ProjectsGrid />
      </div>
    </div>
  );
}
