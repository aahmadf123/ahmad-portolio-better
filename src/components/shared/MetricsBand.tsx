import { jobs } from '@/lib/data/jobs';
import { CountUp } from '@/components/ui/count-up';
import { projects } from '@/lib/data/projects';
import { awards } from '@/lib/data/awards';
import { certs } from '@/lib/data/certs';
import { constellation } from '@/lib/data/skills';

// Every figure is a data module's own .length, never a hand-typed number.
const METRICS: { value: string; label: string }[] = [
  { value: String(jobs.length), label: 'Roles' },
  { value: String(projects.length), label: 'Projects' },
  { value: String(awards.length), label: 'Awards' },
  { value: String(certs.length), label: 'Certifications' },
  { value: String(constellation.nodes.length), label: 'Skills mapped' },
];

/** One line of counts, as text. */
export function MetricsBand() {
  return (
    <dl className="metrics tnum">
      {METRICS.map((m) => (
        <div key={m.label}><dd><CountUp value={m.value} /></dd><dt>{m.label}</dt></div>
      ))}
      <style>{`
        .metrics { display: flex; flex-wrap: wrap; gap: 12px clamp(24px, 4vw, 48px); padding: 18px 0; border-top: 1px solid var(--bd); border-bottom: 1px solid var(--bd); margin-bottom: clamp(36px, 5vw, 64px); }
        .metrics div { display: flex; align-items: baseline; gap: 8px; }
        .metrics dd { font-size: 22px; letter-spacing: -0.02em; }
        .metrics dt { font-size: 14px; color: var(--text2); }
      `}</style>
    </dl>
  );
}
