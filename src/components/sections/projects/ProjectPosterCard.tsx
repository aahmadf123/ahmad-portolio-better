'use client';

import React from 'react';
import { m, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { MONO, SERIF, SANS } from '@/components/shared/section-helpers';
import manifest from '@/lib/image-manifest.json';
import { projectStatusLabel, type Project } from '@/lib/data/projects';

interface ManifestEntry {
  base: string;
  widths: number[];
}

const IMAGE_MANIFEST = manifest as Record<string, ManifestEntry>;

function decodeKey(src: string): string {
  try {
    return decodeURIComponent(src);
  } catch {
    return src;
  }
}

/** Tiny local lookup — mirrors <Pic>'s manifest logic without pulling in the
 * component itself (this image renders as `m.img` so it can carry the
 * hover `variants`/`transition` props; the dependency-free <Pic> is a plain
 * <img> and can't). Manifest miss falls back to the original path with no
 * srcSet/sizes, same graceful degradation as <Pic>. */
function responsiveAttrs(src: string, wide: boolean) {
  const entry = IMAGE_MANIFEST[decodeKey(src)];
  if (!entry) return { src };
  const largest = entry.widths[entry.widths.length - 1];
  return {
    src: `${entry.base}-${largest}.webp`,
    srcSet: entry.widths.map((w) => `${entry.base}-${w}.webp ${w}w`).join(', '),
    sizes: wide
      ? '(max-width: 600px) 100vw, (max-width: 900px) 100vw, 860px'
      : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 420px',
  };
}

const STATUS_COLOR: Record<Project['status'], string> = {
  live: 'var(--green)',
  'active-build': 'var(--red)',
  shipped: 'var(--primary)',
  research: 'var(--blue)',
};

/**
 * Movie-poster treatment: dark minimal base (image, title, status); on hover
 * the image scales, the scrim deepens, and the story line + stat + stacks rise
 * into view. Click opens the detail modal (shared layoutId morph).
 */
export function ProjectPosterCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const p = project;
  const wide = p.span === 2;

  // GPU-only pointer tilt (rotateX/rotateY, capped ±4°). Spring-smoothed follow
  // and reset. Disabled entirely under reduced motion — no handlers attached.
  const reduced = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 26, mass: 0.5 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 26, mass: 0.5 });

  const onTiltMove = reduced
    ? undefined
    : (e: React.PointerEvent<HTMLButtonElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        tiltY.set(Math.max(-4, Math.min(4, nx * 8)));
        tiltX.set(Math.max(-4, Math.min(4, -ny * 8)));
      };
  const resetTilt = reduced
    ? undefined
    : () => {
        tiltX.set(0);
        tiltY.set(0);
      };

  return (
    <m.button
      layoutId={`poster-${p.idx}`}
      onClick={() => { resetTilt?.(); onOpen(p); }}
      onPointerMove={onTiltMove}
      onPointerLeave={resetTilt}
      whileHover="hover"
      initial="rest"
      animate="rest"
      data-magnetic=""
      className="card-project"
      aria-label={`${p.title} — open project details`}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: wide ? '16/8.2' : '3/3.7',
        borderRadius: 12,
        overflow: 'hidden',
        border: `1px solid color-mix(in srgb, ${p.color} 22%, transparent)`,
        background: 'var(--surface)',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
        isolation: 'isolate',
        // Motion values stay at 0 under reduced motion (handlers aren't attached),
        // so they're bound unconditionally — no `reduced`-dependent render output,
        // which keeps SSR/hydration output identical.
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
    >
      {/* image — dimmed and desaturated at rest so bright screenshots stay moody */}
      <m.img
        {...responsiveAttrs(p.image, wide)}
        alt=""
        loading="lazy"
        decoding="async"
        variants={{
          rest: { scale: 1, opacity: 0.34, filter: 'brightness(0.62) saturate(0.7)' },
          hover: { scale: 1.05, opacity: 0.85, filter: 'brightness(0.95) saturate(1)' },
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', zIndex: 0 }}
      />
      {/* scrim */}
      <m.div
        aria-hidden
        variants={{ rest: { opacity: 1 }, hover: { opacity: 0.92 } }}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `linear-gradient(to top, rgba(10,11,15,0.98) 14%, rgba(10,11,15,0.78) 50%, rgba(10,11,15,0.42) 100%), linear-gradient(135deg, color-mix(in srgb, ${p.color} 16%, transparent), transparent 50%)`,
        }}
      />
      {/* edge light on hover */}
      <m.div aria-hidden variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }} transition={{ duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 12, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${p.color} 55%, transparent), 0 8px 40px -12px color-mix(in srgb, ${p.color} 30%, transparent)` }} />

      {/* specular glass sheen — CSS-driven on .card-project:hover (globals.css) */}
      <span className="card-glass-sheen" aria-hidden />

      {/* content */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.color, background: 'rgba(10,11,15,0.55)', padding: '3px 8px', borderRadius: 3, backdropFilter: 'blur(4px)' }}>
            {p.domain} · {p.idx}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLOR[p.status], background: 'rgba(10,11,15,0.55)', padding: '3px 8px', borderRadius: 3, backdropFilter: 'blur(4px)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[p.status], display: 'inline-block' }} />
            {projectStatusLabel[p.status]}
          </span>
        </div>

        <div>
          <h4 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: wide ? 'clamp(24px, 2.2vw, 34px)' : 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.08, letterSpacing: '-0.015em', color: 'var(--foreground)', margin: 0, paddingBottom: '0.05em' }}>
            {p.title}
          </h4>
          <m.div
            variants={{ rest: { opacity: 0, y: 12 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: 'var(--text2)', margin: '8px 0 0', maxWidth: 460 }}>{p.story}</p>
            <div style={{ fontFamily: MONO, fontSize: 10, color: p.color, letterSpacing: '0.05em', marginTop: 8 }}>{p.headline}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
              {p.stacks.slice(0, wide ? 6 : 4).map((t) => (
                <span key={t} style={{ fontFamily: MONO, fontSize: 9, padding: '2px 7px', background: 'rgba(10,11,15,0.6)', border: '1px solid var(--bd2)', borderRadius: 3, color: 'var(--text2)', letterSpacing: '0.03em' }}>{t}</span>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </m.button>
  );
}
