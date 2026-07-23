import React from 'react';
import { ViewTransition } from 'react';
import Link from 'next/link';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import type { Metadata } from 'next';
import { getFieldNote, fieldNotes, CATEGORY_CONFIG } from '@/lib/field-notes';
import { site } from '@/lib/data/site';
import { notFound } from 'next/navigation';
import { Pic } from '@/components/ui/pic';

const SERIF = 'var(--font-display), Georgia, serif';
const MONO  = 'var(--font-code), monospace';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) return {};
  const url = `${site.url}/field-notes/${note.slug}`;
  return {
    title: `${note.title} - Field Notes`,
    description: note.excerpt,
    keywords: note.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      title: note.title,
      description: note.excerpt,
      images: note.heroImage ? [{ url: `${site.url}${note.heroImage}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description: note.excerpt,
      images: note.heroImage ? [`${site.url}${note.heroImage}`] : [],
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    author: { '@type': 'Person', name: 'Ahmad Firas', url: 'https://ahmadfx.xyz' },
    ...(note.heroImage ? { image: [`https://ahmadfx.xyz${note.heroImage}`] } : {}),
    mainEntityOfPage: `https://ahmadfx.xyz/field-notes/${note.slug}`,
  };

  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh', fontFamily: SERIF }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* ── Sticky Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,4vw,52px)',
        borderBottom: '1px solid rgba(242,237,216,0.07)',
        background: 'rgba(13,14,18,0.97)',
        backdropFilter: 'blur(20px)',
      }}>
        <SmartBackLink fallbackHref="/field-notes" backWhenPrev={['/', '/field-notes']} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: 'var(--text2)', fontFamily: MONO, fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'color 0.2s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
          </svg>
          Back
        </SmartBackLink>

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
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>
            {formatDate(note.date)}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)' }}>·</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>
            {note.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: SERIF, fontWeight: 400,
          fontSize: 'var(--text-2xl)', lineHeight: 1.08,
          letterSpacing: '-0.025em', color: 'var(--foreground)',
          marginBottom: 20, paddingBottom: '0.04em',
        }}>
          {note.title}
        </h1>

        {/* Excerpt */}
        <p style={{
          fontSize: 18, lineHeight: 1.75, color: 'var(--text2)',
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
              border: '1px solid rgba(244,244,242,0.1)',
              borderRadius: 4, color: 'var(--text3)',
              letterSpacing: '0.04em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Hero image */}
        {note.heroImage && (
          <ViewTransition name={`fn-img-${note.slug}`} share="morph">
            <div style={{
              width: '100%', borderRadius: 10, overflow: 'hidden',
              border: '1px solid rgba(244,244,242,0.08)',
              marginBottom: 48, background: 'var(--background)',
            }}>
              <Pic
                src={note.heroImage}
                alt={`${note.title} - hero visualization`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>
          </ViewTransition>
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
            background: catCfg ? `${catCfg.color}1c` : 'color-mix(in srgb, var(--gold) 10%, transparent)',
            border: `1px solid ${catCfg ? catCfg.color + '40' : 'color-mix(in srgb, var(--gold) 25%, transparent)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: catCfg?.color ?? 'var(--gold)' }}>AF</span>
          </div>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 14, color: 'var(--foreground)', marginBottom: 2 }}>Ahmad Firas</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.04em' }}>
              AI Researcher · University of Toledo
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/field-notes" transitionTypes={['nav-forward']} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px',
            border: '1px solid rgba(244,244,242,0.12)',
            color: 'var(--text2)', fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.08em', borderRadius: 5,
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            ← All Field Notes
          </Link>
          <Link href="/#field-notes" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px',
            border: '1px solid rgba(244,244,242,0.12)',
            color: 'var(--text2)', fontFamily: MONO, fontSize: 10,
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

