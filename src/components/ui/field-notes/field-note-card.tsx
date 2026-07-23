'use client';

import React from 'react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { Pic } from '@/components/ui/pic';
import type { FieldNote } from '@/lib/field-notes';
import { CATEGORY_CONFIG } from '@/lib/field-notes';

const SERIF = "var(--font-chakra), 'Chakra Petch', sans-serif";
const MONO  = "var(--font-chakra), 'Chakra Petch', monospace";

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function FieldNoteCard({ note }: { note: FieldNote }) {
  const [hovered, setHovered] = React.useState(false);
  const catCfg = CATEGORY_CONFIG[note.category];
  const accentColor = catCfg?.color ?? '#f59e0b';

  return (
    <Link href={`/field-notes/${note.slug}`} style={{ textDecoration: 'none', display: 'block' }} transitionTypes={['nav-forward']}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: '100%',
          background: hovered ? 'rgba(242,237,216,0.04)' : 'rgba(242,237,216,0.025)',
          border: `1px solid ${hovered ? accentColor + '44' : 'rgba(244,244,242,0.08)'}`,
          borderRadius: 10,
          overflow: 'hidden',
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'pointer',
        }}
      >
        {/* Hero image */}
        {note.heroImage && (
          <ViewTransition name={`fn-img-${note.slug}`} share="morph">
            <div style={{
              width: '100%', height: 220, overflow: 'hidden',
              background: 'var(--background)',
              borderBottom: '1px solid rgba(244,244,242,0.06)',
            }}>
              <Pic
                src={note.heroImage}
                alt={note.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </ViewTransition>
        )}

        <div style={{ padding: '20px 22px 24px' }}>
          {/* Category + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {catCfg && (
              <span style={{
                fontFamily: MONO, fontSize: 9, padding: '3px 8px',
                background: `${catCfg.color}14`,
                border: `1px solid ${catCfg.color}30`,
                borderRadius: 4, color: catCfg.color,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {catCfg.label}
              </span>
            )}
            <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text3)', letterSpacing: '0.06em' }}>
              {formatDate(note.date)}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--text3)', letterSpacing: '0.06em', marginLeft: 'auto' }}>
              {note.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: 20, lineHeight: 1.25,
            letterSpacing: '-0.01em', color: 'var(--foreground)',
            marginBottom: 10,
          }}>
            {note.title}
          </h2>

          {/* Excerpt */}
          <p style={{
            fontFamily: SERIF, fontSize: 14, lineHeight: 1.7,
            color: 'var(--text3)', marginBottom: 16,
          }}>
            {note.excerpt}
          </p>

          {/* Tags + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {note.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  fontFamily: MONO, fontSize: 9, padding: '2px 7px',
                  background: 'rgba(242,237,216,0.04)',
                  border: '1px solid rgba(244,244,242,0.1)',
                  borderRadius: 4, color: 'var(--text3)',
                  letterSpacing: '0.04em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <span style={{
              fontFamily: MONO, fontSize: 10, color: accentColor,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}


