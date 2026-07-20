'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, refreshOnFontsReady } from '@/lib/motion/gsap';
import { MONO, SERIF } from '@/components/shared/section-helpers';
import { storyChapters } from '@/lib/data/story';
import { sectionById } from '@/lib/data/sections';
import { StoryChapter } from './StoryChapter';

const CH = storyChapters.length;
const D = 1;      // wipe duration (timeline units)
const HOLD = 0.5; // dwell on each chapter

/**
 * "Walking through" narrative — a pinned 100vh stage where five chapters wipe
 * over each other, scrubbed by scroll (GSAP ScrollTrigger). On mobile and under
 * reduced motion the chapters stack and reveal normally: same components, no pin.
 */
export function StorySection() {
  const def = sectionById('story')!;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  // Decide variant on mount (desktop + fine pointer + motion OK).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    setPinned(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPinned(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!pinned || !wrapRef.current) return;
    const wrap = wrapRef.current;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-story-panel]', wrap);
      const rail = wrap.querySelector<HTMLElement>('[data-story-railfill]');

      // initial states: chapter 0 visible; the rest hidden behind a wipe
      panels.forEach((panel, i) => {
        const lines = panel.querySelectorAll<HTMLElement>('.story-line');
        if (i === 0) {
          gsap.set(panel, { clipPath: 'inset(0% 0% 0% 0%)' });
        } else {
          gsap.set(panel, { clipPath: i % 2 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' });
          gsap.set(lines, { y: 36, autoAlpha: 0 });
        }
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      });

      if (rail) tl.fromTo(rail, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: CH * (D + HOLD) }, 0);

      for (let i = 1; i < CH; i++) {
        const pos = HOLD + (i - 1) * (D + HOLD);
        const prevLines = panels[i - 1].querySelectorAll<HTMLElement>('.story-line');
        const lines = panels[i].querySelectorAll<HTMLElement>('.story-line');
        const media = panels[i].querySelector<HTMLElement>('.story-media');
        const flash = panels[i].querySelector<HTMLElement>('[data-story-flash]');

        tl.to(prevLines, { y: -30, autoAlpha: 0, duration: D * 0.4, stagger: 0.03, ease: 'power1.in' }, pos);
        tl.fromTo(
          panels[i],
          { clipPath: i % 2 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: D, ease: 'power2.inOut' },
          pos + D * 0.1
        );
        if (media) tl.fromTo(media, { yPercent: 7 }, { yPercent: 0, duration: D, ease: 'power2.out' }, pos + D * 0.1);
        tl.fromTo(lines, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: D * 0.5, stagger: 0.05, ease: 'power2.out' }, pos + D * 0.45);
        if (flash) {
          tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power1.in' }, pos + D * 0.3)
            .to(flash, { opacity: 0, duration: 0.35, ease: 'power1.out' }, pos + D * 0.45);
        }
      }
      // settle hold at the end
      tl.to({}, { duration: HOLD });
    }, wrap);

    refreshOnFontsReady();
    return () => ctx.revert();
  }, [pinned]);

  return (
    <section id="story" style={{ position: 'relative', zIndex: 20, background: 'var(--background)' }}>
      {/* section marker */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px, 7vw, 90px) clamp(20px, 4vw, 52px) 0', position: 'relative' }}>
        <div aria-hidden className="ghost-num" style={{ position: 'absolute', top: 8, left: 8, fontFamily: SERIF, fontSize: 'clamp(72px,11vw,160px)', fontWeight: 400, color: def.color, opacity: 0.05, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.03em' }}>{def.n}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', width: 22, height: 1.5, background: def.color, opacity: 0.6 }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: def.color }}>The Story</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em' }}>— five chapters, scroll to walk through</span>
        </div>
      </div>

      <div ref={wrapRef} style={{ position: 'relative', height: pinned ? `${CH * 108 + 40}vh` : 'auto' }}>
        <div style={{
          position: pinned ? 'sticky' : 'relative',
          top: 0,
          height: pinned ? '100vh' : 'auto',
          overflow: pinned ? 'hidden' : 'visible',
        }}>
          {storyChapters.map((c, i) => (
            <StoryChapter key={c.id} chapter={c} index={i} pinned={pinned} />
          ))}

          {/* progress rail (pinned only) */}
          {pinned && (
            <div aria-hidden style={{ position: 'absolute', right: 'clamp(12px, 2vw, 28px)', top: '50%', transform: 'translateY(-50%)', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 2, height: 180, background: 'var(--bd2)', borderRadius: 2, overflow: 'hidden' }}>
                <div data-story-railfill style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${def.color}, var(--gold))`, transformOrigin: 'top', transform: 'scaleY(0)' }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: 'var(--text3)', writingMode: 'vertical-rl' }}>{String(CH).padStart(2, '0')} CH</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .story-grid { grid-template-columns: 1fr !important; }
          .story-media { max-height: 42svh !important; order: -1; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .scene-flow { animation: scene-dash 7s linear infinite; }
          .scene-drift { animation: scene-spin 26s linear infinite; transform-origin: center; transform-box: fill-box; }
        }
        @keyframes scene-dash { to { stroke-dashoffset: -120; } }
        @keyframes scene-spin { to { rotate: 360deg; } }
      `}</style>
    </section>
  );
}
