'use client';

import React from 'react';
import { MONO, SERIF, SANS } from '@/components/shared/section-helpers';
import type { StoryChapter as Chapter } from '@/lib/data/story';
import { ChapterScene } from './ChapterScene';

/**
 * One story panel. In pinned mode panels are absolutely stacked and revealed
 * by clip-path wipes; in stacked mode they flow normally with .reveal.
 */
export function StoryChapter({ chapter, index, pinned }: { chapter: Chapter; index: number; pinned: boolean }) {
  return (
    <article
      className="story-panel"
      data-story-panel={index}
      style={{
        position: pinned ? 'absolute' : 'relative',
        inset: pinned ? 0 : undefined,
        zIndex: index + 1,
        minHeight: pinned ? undefined : '92svh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--background)',
        overflow: 'hidden',
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 52px)',
      }}
    >
      {/* chapter accent atmosphere - parallaxed (slowest depth layer) in pinned mode */}
      <div data-story-bg aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 55% 60% at 72% 45%, color-mix(in srgb, ${chapter.accent} 7%, transparent), transparent 72%)`,
      }} />

      <div className="story-grid" style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: 'minmax(0, 46fr) minmax(0, 54fr)',
        gap: 'clamp(24px, 4vw, 64px)', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {/* copy */}
        <div className="story-copy" data-story-copy={index}>
          <div className="story-line" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1.5, background: chapter.accent, opacity: 0.7 }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: chapter.accent }}>
              {chapter.kicker}
            </span>
            {chapter.milestone && (
              <span aria-label="milestone" style={{ color: 'var(--gold)', fontSize: 13, lineHeight: 1 }}>✦</span>
            )}
          </div>
          <h3 className="story-line" style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: 20,
            lineHeight: 0.98, letterSpacing: '-0.025em',
            color: 'var(--foreground)', margin: 0, paddingBottom: '0.06em',
          }}>
            {chapter.title}
          </h3>
          <p className="story-line" style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: 'var(--text2)', maxWidth: 560, marginTop: 22 }}>
            {chapter.body}
          </p>
          {chapter.stat && (
            <div className="story-line" style={{ marginTop: 26, display: 'inline-flex', alignItems: 'baseline', gap: 14, padding: '14px 20px', border: `1px solid color-mix(in srgb, ${chapter.accent} 25%, transparent)`, borderRadius: 8, background: `color-mix(in srgb, ${chapter.accent} 4%, transparent)` }}>
              <span style={{ fontFamily: SERIF, fontSize: 20, color: chapter.milestone ? 'var(--gold)' : chapter.accent, lineHeight: 1 }}>{chapter.stat.value}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', maxWidth: 240 }}>{chapter.stat.label}</span>
            </div>
          )}
        </div>

        {/* scene */}
        <div className="story-media" data-story-media={index} style={{ position: 'relative', aspectRatio: '1', maxHeight: pinned ? '72svh' : '58svh', margin: '0 auto', width: 'min(100%, 560px)' }}>
          <ChapterScene scene={chapter.scene} accent={chapter.accent} />
        </div>
      </div>

      {/* milestone flash overlay */}
      {chapter.milestone && (
        <div className="story-flash" data-story-flash={index} aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(245,158,11,0.28), rgba(245,158,11,0.06) 55%, transparent 75%)',
        }} />
      )}
    </article>
  );
}
