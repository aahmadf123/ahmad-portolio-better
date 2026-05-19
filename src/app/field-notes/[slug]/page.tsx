import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getFieldNote, fieldNotes, CATEGORY_CONFIG } from '@/lib/field-notes';
import { notFound } from 'next/navigation';

const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) return {};
  return {
    title: `${note.title} — Field Notes`,
    description: note.excerpt,
    openGraph: {
      title: note.title,
      description: note.excerpt,
      images: note.heroImage ? [{ url: note.heroImage }] : [],
    },
  };
}

export function generateStaticParams() {
  return fieldNotes.filter(n => n.published).map(n => ({ slug: n.slug }));
}

export const dynamicParams = false;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function FieldNotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = getFieldNote(slug);

  if (!note || !note.published) notFound();

  const { default: Article } = await import(`@/content/field-notes/${slug}.mdx`);
  const catCfg = CATEGORY_CONFIG[note.category];

  return (
    <div style={{ background: '#0B0D14', color: '#F2EDD8', minHeight: '100vh', fontFamily: SERIF }}>

      {/* ── Sticky Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,4vw,52px)',
        borderBottom: '1px solid rgba(242,237,216,0.07)',
        background: 'rgba(11,13,20,0.97)',
        backdropFilter: 'blur(20px)',
      }}>
        <Link href="/field-notes" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#B8B4A4', fontFamily: MONO, fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'color 0.2s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
          </svg>
          Field Notes
        </Link>

        {catCfg && (
          <span style={{
            fontFamily: MONO, fontSize: 9, padding: '5px 12px',
            background: `${catCfg.color}14`,
            border: `1px solid ${catCfg.color}35`,
            borderRadius: 4, color: catCfg.color,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {catCfg.label}
          </span>
        )}
      </header>

      {/* ── Article Hero ── */}
      <div style={{
        padding: 'clamp(48px,7vw,80px) clamp(20px,4vw,52px) 0',
        maxWidth: 840, margin: '0 auto',
      }}>
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.06em' }}>
            {formatDate(note.date)}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#4A4843' }}>·</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.06em' }}>
            {note.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: SERIF, fontWeight: 400,
          fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.08,
          letterSpacing: '-0.025em', color: '#F2EDD8',
          marginBottom: 20, paddingBottom: '0.04em',
        }}>
          {note.title}
        </h1>

        {/* Excerpt */}
        <p style={{
          fontSize: 18, lineHeight: 1.75, color: '#8A877A',
          maxWidth: 680, marginBottom: 28, fontFamily: SERIF,
        }}>
          {note.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 36 }}>
          {note.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: MONO, fontSize: 9, padding: '3px 8px',
              background: 'rgba(242,237,216,0.04)',
              border: '1px solid rgba(242,237,216,0.1)',
              borderRadius: 3, color: '#6E6B60',
              letterSpacing: '0.04em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Hero image */}
        {note.heroImage && (
          <div style={{
            width: '100%', borderRadius: 12, overflow: 'hidden',
            border: '1px solid rgba(242,237,216,0.08)',
            marginBottom: 48, background: '#06080E',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.heroImage}
              alt={`${note.title} — hero visualization`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}
      </div>

      {/* ── Article divider ── */}
      <div style={{
        maxWidth: 840, margin: '0 auto',
        padding: '0 clamp(20px,4vw,52px)',
        borderBottom: '1px solid rgba(242,237,216,0.06)',
        marginBottom: 0,
      }} />

      {/* ── MDX Content ── */}
      <article style={{
        maxWidth: 840,
        margin: '0 auto',
        padding: 'clamp(40px,6vw,64px) clamp(20px,4vw,52px) clamp(80px,10vw,120px)',
      }}>
        <Article />
      </article>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(242,237,216,0.06)',
        padding: 'clamp(40px,6vw,64px) clamp(20px,4vw,52px)',
        maxWidth: 840, margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Author line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(240,180,41,0.1)',
            border: '1px solid rgba(240,180,41,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: '#F0B429' }}>AF</span>
          </div>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 14, color: '#F2EDD8', marginBottom: 2 }}>Ahmad Firas</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: '#6E6B60', letterSpacing: '0.04em' }}>
              AI Researcher · University of Toledo
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/field-notes" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px',
            border: '1px solid rgba(242,237,216,0.12)',
            color: '#B8B4A4', fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.08em', borderRadius: 5,
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            ← All Field Notes
          </Link>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px',
            border: '1px solid rgba(242,237,216,0.12)',
            color: '#B8B4A4', fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.08em', borderRadius: 5,
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            Portfolio ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
