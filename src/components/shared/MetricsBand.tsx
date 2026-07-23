'use client';

import { useReveal, MONO, SERIF, FG3 } from '@/components/shared/section-helpers';
import { jobs } from '@/lib/data/jobs';
import { projects } from '@/lib/data/projects';
import { awards } from '@/lib/data/awards';
import { certs } from '@/lib/data/certs';
import { constellation } from '@/lib/data/skills';

// Module-scope computed values - every figure here is a data module's own
// .length, never a hand-typed number that can silently drift out of sync.
const METRICS: { value: string; label: string }[] = [
  { value: String(jobs.length), label: 'Roles' },
  { value: String(projects.length), label: 'Projects' },
  { value: String(awards.length), label: 'Awards' },
  { value: String(certs.length), label: 'Certifications' },
  { value: String(constellation.nodes.length), label: 'Skills mapped' },
];

/**
 * Thin full-width metrics strip - a fast, honest "who is this" scan computed
 * directly from the site's own data modules. Sits at the top of About, right
 * under the section header.
 */
export function MetricsBand() {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'in' : ''}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 'clamp(28px, 5vw, 56px)',
        rowGap: 18,
        borderTop: '1px solid var(--bd)',
        borderBottom: '1px solid var(--bd)',
        padding: 'clamp(20px, 3vw, 26px) 0',
        marginBottom: 'clamp(36px, 5vw, 64px)',
      }}
    >
      {METRICS.map((metric) => (
        <div key={metric.label}>
          <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 20, lineHeight: 1, color: 'var(--foreground)' }}>
            {metric.value}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: FG3, marginTop: 7 }}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
