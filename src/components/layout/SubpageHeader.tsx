'use client';

import React from 'react';
import Link from 'next/link';
import { SmartBackLink } from '@/components/ui/smart-back-link';
import { useScroll } from '@/components/ui/use-scroll';

const SERIF = 'var(--font-display), Georgia, serif';
const MONO = 'var(--font-code), ui-monospace, monospace';

/**
 * One header for every non-home page (case studies, field notes, docs):
 * the same 56px bar, colours and logo as the site header, a smart back link
 * on the left (history back when you came from inside the site), and an
 * optional page-specific slot on the right. Replaces six hand-rolled headers
 * that each used a different height, background and back label.
 */
export function SubpageHeader({
  backHref,
  backLabel,
  backWhenPrev,
  restoreScroll,
  accent = 'var(--primary)',
  children,
}: {
  backHref: string;
  backLabel: string;
  backWhenPrev?: string[];
  /** Land where the reader last left the back destination (SmartBackLink). */
  restoreScroll?: boolean;
  accent?: string;
  children?: React.ReactNode;
}) {
  const scrolled = useScroll(8);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100, height: 56,
        background: scrolled ? 'rgba(13,14,18,0.94)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--bd)' : 'transparent'}`,
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{
        height: '100%', maxWidth: 1280, margin: '0 auto',
        padding: '0 clamp(16px, 3vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 28px)', minWidth: 0 }}>
          <Link href="/" aria-label="Ahmad Firas - home" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--primary)', boxShadow: '0 0 10px rgba(45,212,191,0.6)' }} />
            <span className="subpage-logo" style={{ fontFamily: SERIF, fontSize: 18, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Ahmad.dev</span>
          </Link>
          <SmartBackLink
            fallbackHref={backHref}
            backWhenPrev={backWhenPrev}
            restoreScroll={restoreScroll}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text2)', textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            {backLabel}
          </SmartBackLink>
        </div>
        {children && (
          <div className="subpage-right" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, color: accent }}>
            {children}
          </div>
        )}
      </div>
      {/* Phones: the right slot (page title / report links) repeats what the hero
          right below shows, so drop it rather than wrap it into two lines. */}
      <style>{`@media (max-width: 420px) { .subpage-logo { display: none; } } @media (max-width: 560px) { .subpage-right { display: none !important; } }`}</style>
    </header>
  );
}
