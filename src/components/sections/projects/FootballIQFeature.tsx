'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { MONO, SERIF, SANS, Tag } from '@/components/shared/section-helpers';
import { flagshipProject, projectStatusLabel } from '@/lib/data/projects';
import { Pic, largestVariant } from '@/components/ui/pic';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';
import { useProjectModal } from './ProjectModalProvider';
import { PlayDiagram } from './PlayDiagram';

/** A real screen from the Football IQ build: Clip Review with its vision overlays and play labels. */
const OUTPUT = {
  src: '/Images/Football_IQ_Clip_Review.png',
  alt: 'Toledo Football IQ Clip Review screen: an overhead practice clip with player-tracking overlays, the play marked Preliminary and Reviewed, and the play tag fields beside it.',
};

const label: React.CSSProperties = { fontFamily: MONO, fontSize: 14, color: 'var(--foreground)' };

/**
 * Full-width flagship panel for Toledo Football IQ: the pipeline explanation with its
 * tools and count-up stats, one actual output from the build beside it, the animated
 * play diagram (marked as an illustrative example), and the case-study CTA.
 */
export function FootballIQFeature() {
  const p = flagshipProject;
  const rootRef = useRef<HTMLDivElement>(null);
  const openLb = useLightboxOpen();
  const { open } = useProjectModal();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>('[data-count]', root);
      ScrollTrigger.create({
        trigger: root,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          nums.forEach((el) => {
            const target = parseFloat(el.dataset.count ?? '0');
            const suffix = el.dataset.suffix ?? '';
            const obj = { v: 0 };
            let shown = '';
            gsap.to(obj, {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                const t = `${Math.round(obj.v)}${suffix}`;
                if (t !== shown) { shown = t; el.textContent = t; } // only when the number changes
              },
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: 10, suffix: '', label: 'Pipeline stages' },
    { value: 18, suffix: '+', label: 'Structured metrics' },
    { value: 90, suffix: '%+', label: 'Field-marking accuracy target' },
  ];

  return (
    <div
      ref={rootRef}
      className="fiq-panel"
      style={{
        position: 'relative',
        border: '1px solid rgba(239,68,68,0.28)',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(13,14,18,0.4) 45%, rgba(45,212,191,0.04))',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div className="fiq-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 46fr) minmax(0, 54fr)', gap: 'clamp(24px, 3vw, 44px)', padding: 'clamp(20px, 3.5vw, 44px)', alignItems: 'start' }}>
        {/* the pipeline explanation */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px', marginBottom: 12 }}>
            <div style={{ ...label, color: 'var(--red)' }}>Flagship · {p.tag}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span className="pulse" aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
              <span style={{ ...label, color: 'var(--red)' }}>{projectStatusLabel[p.status]}</span>
            </div>
          </div>
          <h3 id="toledo-football-iq-title" style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--fs-section-head)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.06em' }}>
            {p.title}
          </h3>
          <div style={{ ...label, color: 'color-mix(in srgb, var(--red) 70%, #f4f4f2)', marginTop: 10 }}>{p.headline}</div>
          <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: 'var(--foreground)', maxWidth: 540, marginTop: 16 }}>
            {p.story} A 10-stage pipeline from drone footage to coach dashboard - every output connects to the exact clip, overlay, confidence score, and correction path.
          </p>

          {/* tools, directly below the description */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
            {p.stacks.map((t) => <Tag key={t} size={14}>{t}</Tag>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(130px, 100%), 1fr))', gap: '18px clamp(16px, 2.5vw, 28px)', marginTop: 26 }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: SERIF, fontSize: 'var(--fs-stat-xl)', lineHeight: 1, color: 'var(--gold)' }}>
                  <span data-count={s.value} data-suffix={s.suffix}>{`${s.value}${s.suffix}`}</span>
                </div>
                <div style={{ ...label, color: 'var(--text2)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href={`/case-study/${p.slug}`} transitionTypes={['nav-forward']} data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--red)', color: 'var(--background)', fontFamily: MONO, fontSize: 14, fontWeight: 700, borderRadius: 5 }}>
              Read the case study ↗
            </Link>
            <button type="button" onClick={() => open(p)} style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: 'var(--background)', border: '1px solid var(--text2)', color: 'var(--foreground)', fontFamily: MONO, fontSize: 14, borderRadius: 5, cursor: 'pointer' }}>
              {p.detailsLabel ?? 'Details →'}
            </button>
          </div>
          <p style={{ ...label, color: 'var(--text2)', marginTop: 12 }}>Live URL coming when it ships</p>
        </div>

        {/* one actual output from the build */}
        <figure style={{ margin: 0, minWidth: 0 }}>
          <h4 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--fs-stat-lg)', lineHeight: 1.1, color: 'var(--foreground)', margin: '0 0 12px' }}>Inspect a practice-film analysis</h4>
          <button
            type="button"
            onClick={() => openLb(largestVariant(OUTPUT.src), OUTPUT.alt)}
            aria-label="Enlarge the Clip Review screen"
            style={{ display: 'block', width: '100%', padding: 0, border: '1px solid var(--bd2)', borderRadius: 8, overflow: 'hidden', background: 'var(--background)', cursor: 'zoom-in' }}
          >
            <Pic src={OUTPUT.src} alt={OUTPUT.alt} sizes="(max-width: 900px) 92vw, 640px" style={{ display: 'block', width: '100%', height: 'auto' }} />
          </button>
          <figcaption style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.55, color: 'var(--foreground)', marginTop: 10 }}>
            Review a clip, inspect an overlay and see the associated labels.
          </figcaption>
        </figure>
      </div>

      {/* the animated diagram is a drawing, not output: say so */}
      <figure className="fiq-illustration" style={{ margin: 0, padding: '0 clamp(20px, 3.5vw, 44px) clamp(20px, 3.5vw, 44px)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', border: '1px solid var(--bd2)', borderRadius: 8, background: 'var(--background)', padding: 'clamp(12px, 2vw, 20px)' }}>
          <div style={{ ...label, display: 'inline-block', border: '1px solid var(--text2)', borderRadius: 4, padding: '2px 8px', marginBottom: 10 }}>Illustrative example</div>
          <PlayDiagram />
          <figcaption style={{ ...label, color: 'var(--text2)', textAlign: 'center', marginTop: 10 }}>
            Detection → tracking → labels - rendered from the pipeline&apos;s point of view
          </figcaption>
        </div>
      </figure>

      <style>{`@media (max-width: 900px) { .fiq-grid { grid-template-columns: minmax(0, 1fr) !important; } }`}</style>
    </div>
  );
}
