import React from 'react';
import type { Metadata } from 'next';
import { SubpageHeader } from '@/components/layout/SubpageHeader';
import { getPublishedNotes } from '@/lib/field-notes';
import { FieldNoteCard } from '@/components/ui/field-notes/field-note-card';

const FN_DESCRIPTION = 'Technical essays on AI engineering, systems thinking, sports analytics, and the path from research to production.';

// Short title (root template appends " · Ahmad Firas"), plus its own canonical
// and social card - it used to inherit the homepage's canonical "/".
export const metadata: Metadata = {
  title: 'Field Notes',
  description: FN_DESCRIPTION,
  alternates: { canonical: 'https://ahmadfx.xyz/field-notes' },
  openGraph: {
    type: 'website',
    url: 'https://ahmadfx.xyz/field-notes',
    title: 'Field Notes · Ahmad Firas',
    description: FN_DESCRIPTION,
    images: [{ url: '/Images/optimized/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Field Notes · Ahmad Firas', description: FN_DESCRIPTION, images: ['/Images/optimized/og.png'] },
};

const SERIF = 'var(--font-body), system-ui, sans-serif';
const MONO = 'var(--font-body), system-ui, sans-serif';

export default function FieldNotesPage() {
  const published = getPublishedNotes();

  return (
    <div style={{ background: 'transparent', position: 'relative', isolation: 'isolate', color: 'var(--foreground)', minHeight: '100vh', fontFamily: SERIF }}>

      <SubpageHeader backHref="/#field-notes" backLabel="Portfolio" />

      {/* ── Hero ── */}
      <div style={{
        padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,52px) clamp(48px,7vw,80px)',
        maxWidth: 1200, margin: '0 auto',
        position: 'relative', overflow: 'hidden',
      }}>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: 'var(--bd2)', opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 0, color: 'var(--primary)' }}>
              Field Notes
            </span>
          </div>

          <h1 style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: 'var(--text-3xl)', lineHeight: 1.0,
            letterSpacing: '-0.03em', color: 'var(--foreground)',
            marginBottom: 24, paddingBottom: '0.04em',
          }}>
            Essays from<br />
            <span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>the frontier.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.75, color: 'var(--text2)',
            maxWidth: 560, margin: '0 auto', fontFamily: 'var(--font-body), sans-serif',
          }}>
            What actually works, what fails in production, and what I am still figuring out -
            across AI engineering, autonomous systems, sports analytics, and the path from research to shipping.
          </p>
        </div>
      </div>

      {/* ── Essays ── */}
      {published.length > 0 && (
        <div style={{ padding: '0 clamp(20px,4vw,52px) 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1.5, background: 'var(--primary)', opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 0, color: 'var(--primary)' }}>
              Essays
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 20 }}>
            {published.map((note) => (
              <FieldNoteCard key={note.slug} note={note} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

