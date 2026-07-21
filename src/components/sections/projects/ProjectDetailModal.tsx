'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { MONO, SERIF } from '@/components/shared/section-helpers';
import { Pic } from '@/components/ui/pic';
import type { Project } from '@/lib/data/projects';
import { ProjectDetail } from './ProjectDetail';

/**
 * Cinematic project modal — morphs out of the clicked poster (shared
 * layoutId), scroll-locked, ESC/scrim close, focus-trapped.
 */
export function ProjectDetailModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // scroll lock + esc + focus
  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button')?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [project, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <m.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'rgba(8,9,12,0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(12px, 3vw, 40px)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          <m.div
            ref={panelRef}
            layoutId={`poster-${project.idx}`}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 'min(880px, 100%)',
              maxHeight: 'min(86svh, 900px)',
              overflowY: 'auto',
              background: 'var(--surface)',
              border: `1px solid color-mix(in srgb, ${project.color} 30%, transparent)`,
              borderRadius: 14,
              position: 'relative',
            }}
          >
            {/* header image */}
            <div style={{ position: 'relative', aspectRatio: '16/6', overflow: 'hidden', borderRadius: '14px 14px 0 0', background: 'var(--background)' }}>
              <Pic src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.9 }} />
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, var(--surface) 4%, transparent 55%), linear-gradient(135deg, color-mix(in srgb, ${project.color} 12%, transparent), transparent 50%)` }} />
              <button
                onClick={onClose}
                aria-label="Close project details"
                style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(10,11,15,0.7)', color: 'var(--foreground)',
                  border: '1px solid var(--bd2)', cursor: 'pointer',
                  fontSize: 16, lineHeight: 1, backdropFilter: 'blur(6px)',
                }}
              >✕</button>
            </div>

            <div style={{ padding: 'clamp(20px, 3vw, 36px)' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: project.color, marginBottom: 10 }}>
                {project.domain} · {project.idx} — {project.tag}
              </div>
              <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(26px, 3vw, 40px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.06em' }}>
                {project.title}
              </h3>
              <div style={{ fontFamily: MONO, fontSize: 11, color: project.color, letterSpacing: '0.04em', marginTop: 10 }}>{project.headline}</div>

              <div style={{ marginTop: 20, fontSize: 15, lineHeight: 1.8, color: 'var(--text2)' }} className="pdm-body">
                <ProjectDetail project={project} />
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
