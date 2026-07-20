'use client';

import React from 'react';
import Link from 'next/link';
import { Section, useReveal, MONO, SERIF, SANS, FG2, FG3 } from '@/components/shared/section-helpers';
import { fieldNotes } from '@/lib/field-notes';
import { FieldNoteCard } from '@/components/ui/field-notes/field-note-card';
import { sectionById } from '@/lib/data/sections';

export function FieldNotesSection() {
  const { ref, visible } = useReveal();
  const def = sectionById('field-notes')!;
  const published = fieldNotes
    .filter(n => n.published && n.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Section id="field-notes">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 52 }}>
        <div style={{ position: 'relative', paddingTop: 8, flex: 1 }}>
          <div aria-hidden className="ghost-num" style={{ position: 'absolute', top: -32, left: -8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color: def.color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em', zIndex: 0 }}>{def.n}</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1.5, background: def.color, opacity: 0.6, flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: def.color }}>Field Notes</span>
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
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,212,191,0.08)'; e.currentTarget.style.borderColor = def.color; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)'; }}
        >
          View All ↗
        </Link>
      </div>

      <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
        {published.length > 0
          ? published.map(note => <FieldNoteCard key={note.slug} note={note} />)
          : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: FG3, fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              New field notes coming soon.
            </div>
          )
        }
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <Link
          href="/field-notes"
          transitionTypes={['nav-forward']}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: def.color, color: '#06211e',
            fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            borderRadius: 5, textTransform: 'uppercase', textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Browse All Field Notes ↗
        </Link>
      </div>
    </Section>
  );
}
