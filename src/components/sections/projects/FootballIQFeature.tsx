'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { MONO, SERIF, SANS, Tag } from '@/components/shared/section-helpers';
import { flagshipProject, projectStatusLabel } from '@/lib/data/projects';
import { PlayDiagram } from './PlayDiagram';

/**
 * Full-width flagship panel for Toledo Football IQ: count-up stats (fire once
 * on scroll), the animated play diagram, stack chips, and the case-study CTA.
 */
export function FootballIQFeature() {
  const p = flagshipProject;
  const rootRef = useRef<HTMLDivElement>(null);

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
            gsap.to(obj, {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}`; },
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
    { value: 90, suffix: '%+', label: 'Field-marking accuracy' },
  ];

  return (
    <div
      ref={rootRef}
      className="fiq-panel"
      style={{
        position: 'relative',
        border: '1px solid rgba(239,68,68,0.28)',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(13,14,18,0.4) 45%, rgba(45,212,191,0.04))',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 28,
      }}
    >
      {/* corner status */}
      <div style={{ position: 'absolute', top: 16, right: 18, display: 'flex', alignItems: 'center', gap: 7, zIndex: 2 }}>
        <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)' }}>{projectStatusLabel[p.status]}</span>
      </div>

      <div className="fiq-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 48fr) minmax(0, 52fr)', gap: 'clamp(20px, 3vw, 44px)', padding: 'clamp(24px, 3.5vw, 44px)', alignItems: 'center' }}>
        {/* copy + stats */}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>
            Flagship · {p.tag}
          </div>
          <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(30px, 3.6vw, 52px)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.06em' }}>
            {p.title}
          </h3>
          <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.75, color: 'var(--text2)', maxWidth: 520, marginTop: 16 }}>
            {p.story} A 10-stage pipeline from drone footage to coach dashboard — every output connects to the exact clip, overlay, confidence score, and correction path.
          </p>

          <div style={{ display: 'flex', gap: 'clamp(16px, 2.5vw, 36px)', marginTop: 26, flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 3vw, 44px)', lineHeight: 1, color: 'var(--gold)' }}>
                  <span data-count={s.value} data-suffix={s.suffix}>{`${s.value}${s.suffix}`}</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 24 }}>
            {p.stacks.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap' }}>
            <Link href={`/case-study/${p.slug}`} transitionTypes={['nav-forward']} data-magnetic="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: 'var(--red)', color: 'var(--background)', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', borderRadius: 5, textTransform: 'uppercase' }}>
              Read the case study ↗
            </Link>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--text3)', alignSelf: 'center', letterSpacing: '0.04em' }}>Live URL coming when it ships</span>
          </div>
        </div>

        {/* play visualization */}
        <div style={{ minWidth: 0 }}>
          <PlayDiagram />
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', textAlign: 'center', marginTop: 10 }}>
            Detection → tracking → labels — rendered from the pipeline&apos;s point of view
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .fiq-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
