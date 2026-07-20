'use client';

import React from 'react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { fieldNotes, CATEGORY_CONFIG } from '@/lib/field-notes';
import { sectionById } from '@/lib/data/sections';

/**
 * Field Notes as an editorial spread: the featured essay gets the full
 * magazine treatment (dateline, pull excerpt, hero image with the shared
 * view-transition morph); upcoming registry titles appear as an intentional
 * "in the darkroom" strip. All registry content preserved.
 */
export function FieldNotesSection() {
  const def = sectionById('field-notes')!;
  const reduced = useReducedMotion();
  const published = fieldNotes
    .filter(n => n.published && n.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featured = published[0];
  const rest = published.slice(1, 3);
  const upNext = fieldNotes.filter(n => !n.published).slice(0, 4);
  const catColor = featured ? (CATEGORY_CONFIG[featured.category]?.color ?? def.color) : def.color;

  return (
    <Section id="field-notes">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 46 }}>
        <div style={{ position: 'relative', paddingTop: 8, flex: 1 }}>
          <div aria-hidden className="ghost-num" style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color: def.color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{def.n}</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1.5, background: def.color, opacity: 0.6, flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: def.color }}>Field Notes</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>— the editorial desk</span>
            </div>
            <p style={{ fontSize: 15, color: FG2, maxWidth: 500, lineHeight: 1.65, marginTop: 4, fontFamily: SANS }}>
              Thinking in public — dispatches from the edge of AI, robotics, and real-world systems.
            </p>
          </div>
        </div>
        <Link
          href="/field-notes"
          transitionTypes={['nav-forward']}
          style={{
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: def.color, border: '1px solid rgba(45,212,191,0.3)', borderRadius: 5,
            padding: '9px 18px', textDecoration: 'none', flexShrink: 0, marginTop: 8,
            display: 'inline-block',
          }}
        >
          All Notes ↗
        </Link>
      </div>

      {/* Featured editorial spread */}
      {featured && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/field-notes/${featured.slug}`}
            transitionTypes={['nav-forward']}
            className="fn-featured"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 56fr) minmax(0, 44fr)',
              gap: 0,
              border: `1px solid color-mix(in srgb, ${catColor} 25%, transparent)`,
              borderRadius: 14,
              overflow: 'hidden',
              background: `linear-gradient(135deg, color-mix(in srgb, ${catColor} 6%, transparent), var(--surface) 55%)`,
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: 'clamp(24px, 3.5vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: catColor, border: `1px solid color-mix(in srgb, ${catColor} 40%, transparent)`, borderRadius: 3, padding: '3px 8px' }}>
                  Featured · {featured.category}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: FG3, letterSpacing: '0.06em' }}>
                  {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {featured.readingTime} min read
                </span>
              </div>
              <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(24px, 2.6vw, 38px)', lineHeight: 1.12, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: '16px 0 0', paddingBottom: '0.05em' }}>
                {featured.title}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.75, color: FG2, marginTop: 14, maxWidth: 560 }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 16 }}>
                {featured.tags.map((t) => (
                  <span key={t} style={{ fontFamily: MONO, fontSize: 9, padding: '3px 8px', background: 'rgba(244,244,242,0.03)', border: '1px solid var(--bd)', borderRadius: 3, color: FG3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t}</span>
                ))}
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: catColor, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 20 }}>Read the essay →</span>
            </div>
            {featured.heroImage && (
              <div style={{ position: 'relative', minHeight: 260, background: 'var(--background)' }}>
                <ViewTransition name={`fn-img-${featured.slug}`} share="morph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                </ViewTransition>
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, var(--surface) 0%, transparent 30%)` }} />
              </div>
            )}
          </Link>
        </motion.div>
      )}

      {/* Secondary published (when more essays ship) + darkroom strip */}
      <div className="fn-lower" style={{ display: 'grid', gridTemplateColumns: rest.length > 0 ? 'repeat(2, 1fr)' : '1fr', gap: 14, marginTop: 14 }}>
        {rest.map((note) => {
          const c = CATEGORY_CONFIG[note.category]?.color ?? def.color;
          return (
            <Link key={note.slug} href={`/field-notes/${note.slug}`} transitionTypes={['nav-forward']} style={{ border: '1px solid var(--bd)', borderRadius: 10, padding: '18px 20px', background: 'rgba(244,244,242,0.02)', textDecoration: 'none' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: c, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{note.category}</span>
              <div style={{ fontFamily: SERIF, fontSize: 19, color: 'var(--foreground)', marginTop: 6, lineHeight: 1.3 }}>{note.title}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: FG3, marginTop: 8 }}>{note.readingTime} min read</div>
            </Link>
          );
        })}

        <div style={{ border: '1px dashed var(--bd2)', borderRadius: 10, padding: '18px 20px', background: 'rgba(244,244,242,0.012)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: def.color, display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: FG3, letterSpacing: '0.14em', textTransform: 'uppercase' }}>In the darkroom · {fieldNotes.filter(n => !n.published).length} essays planned</span>
          </div>
          <div className="fn-upnext" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 20px' }}>
            {upNext.map((n) => (
              <div key={n.slug} style={{ fontFamily: SANS, fontSize: 12.5, color: FG3, lineHeight: 1.5, display: 'flex', gap: 8 }}>
                <span aria-hidden style={{ color: CATEGORY_CONFIG[n.category]?.color ?? FG3, opacity: 0.6, flexShrink: 0 }}>◦</span>
                {n.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .fn-featured { grid-template-columns: 1fr !important; }
          .fn-featured > div:last-child { min-height: 200px !important; order: -1; }
          .fn-lower { grid-template-columns: 1fr !important; }
          .fn-upnext { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  );
}
