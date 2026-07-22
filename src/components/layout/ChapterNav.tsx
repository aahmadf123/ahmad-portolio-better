'use client';

import React, { useEffect, useState } from 'react';
import { sections } from '@/lib/data/sections';
import { MONO } from '@/components/shared/section-helpers';

const CHAPTERS = sections.filter((s) => s.id !== 'hero');

/**
 * Fixed left-side chapter rail (desktop only): one dot per chapter, active dot
 * grows and takes the section color, labels slide out on hover.
 */
export function ChapterNav() {
  const [active, setActive] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only meaningful on the homepage where the chapters exist.
    const observers: IntersectionObserver[] = [];
    let found = 0;
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      found += 1;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0, rootMargin: '-35% 0px -55% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });
    setShow(found > 4);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  if (!show) return null;

  return (
    <nav aria-label="Chapters" className="chapter-nav" style={{
      position: 'fixed',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '10px 6px',
    }}>
      {CHAPTERS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="chapter-dot"
            aria-label={`${s.n ? `Chapter ${s.n} - ` : ''}${s.label}`}
            aria-current={isActive ? 'true' : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minHeight: 12 }}
          >
            <span
              aria-hidden
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                borderRadius: '50%',
                background: isActive ? s.color : 'var(--bd2)',
                boxShadow: isActive ? `0 0 10px ${s.color}` : 'none',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                flexShrink: 0,
              }}
            />
            <span
              className="chapter-label"
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? s.color : 'var(--text3)',
                background: 'rgba(13,14,18,0.85)',
                border: '1px solid var(--bd)',
                borderRadius: 4,
                padding: '3px 8px',
                whiteSpace: 'nowrap',
                opacity: 0,
                transform: 'translateX(-6px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                pointerEvents: 'none',
              }}
            >
              {s.n ? `${s.n} · ` : ''}{s.label}
            </span>
          </a>
        );
      })}
      <style>{`
        @media (max-width: 1023px) { .chapter-nav { display: none !important; } }
        .chapter-dot:hover .chapter-label, .chapter-dot:focus-visible .chapter-label { opacity: 1; transform: translateX(0); }
      `}</style>
    </nav>
  );
}
