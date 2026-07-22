import React from 'react';
import type { Metadata } from 'next';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { fieldNotes } from '@/lib/field-notes';
import { FieldNoteCard } from '@/components/ui/field-notes/field-note-card';

export const metadata: Metadata = {
  title: 'Field Notes - Ahmad Firas',
  description: 'Technical essays on AI engineering, systems thinking, sports analytics, and the path from research to production.',
};

const SERIF = 'var(--font-display), Georgia, serif';
const MONO  = 'var(--font-code), monospace';

export default function FieldNotesPage() {
  const published = fieldNotes.filter(n => n.published);

  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', fontFamily: SERIF }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,4vw,52px)',
        borderBottom: '1px solid var(--bd)',
        background: 'rgba(13,14,18,0.96)',
        backdropFilter: 'blur(20px)',
      }}>
        <SmartBackLink fallbackHref="/#field-notes" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: 'var(--text2)', fontFamily: MONO, fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'color 0.2s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
          </svg>
          Ahmad.dev
        </SmartBackLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: 'var(--primary)', boxShadow: '0 0 8px rgba(45,212,191,0.6)' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--foreground)', letterSpacing: '0.08em' }}>
            Field Notes
          </span>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>
          Essays
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,52px) clamp(48px,7vw,80px)',
        maxWidth: 1200, margin: '0 auto',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background number */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, right: -20,
          fontFamily: SERIF, fontSize: 'clamp(180px,25vw,320px)',
          fontWeight: 400, color: 'var(--primary)', opacity: 0.03,
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.05em', zIndex: 0,
        }}>
          FN
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: 'linear-gradient(90deg, var(--primary), var(--gold))', opacity: 0.8 }} />
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)' }}>
              Field Notes
            </span>
          </div>

          <h1 style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: 'clamp(40px,7vw,88px)', lineHeight: 1.0,
            letterSpacing: '-0.03em', color: 'var(--foreground)',
            marginBottom: 24, paddingBottom: '0.04em',
          }}>
            Essays from<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>the frontier.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.75, color: 'var(--text2)',
            maxWidth: 560, marginBottom: 0, fontFamily: 'var(--font-body), sans-serif',
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
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)' }}>
              Essays
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {published.map((note) => (
              <FieldNoteCard key={note.slug} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--bd)',
        padding: '32px clamp(20px,4vw,52px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>
          Field Notes · Ahmad Firas
        </span>
        <SmartBackLink fallbackHref="/#field-notes" style={{
          fontFamily: MONO, fontSize: 10, color: 'var(--text2)',
          textDecoration: 'none', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          ← Portfolio
        </SmartBackLink>
      </footer>
    </div>
  );
}
