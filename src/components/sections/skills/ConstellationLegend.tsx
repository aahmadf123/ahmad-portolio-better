'use client';

import React from 'react';
import { MONO } from '@/components/shared/section-helpers';
import { skillGroups, constellation } from '@/lib/data/skills';

// Per-group node counts, computed once from the (deduped) constellation graph.
const GROUP_COUNTS: Record<string, number> = constellation.nodes.reduce((acc, n) => {
  acc[n.group] = (acc[n.group] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

/**
 * Legend that doubles as a cluster filter. Each chip toggles focus on one group;
 * a trailing "Show all" resets. Colors come straight from `skillGroups[i].color`
 * (the single palette authority), so chips match the stars they isolate.
 */
export function ConstellationLegend({
  focus,
  onToggle,
}: {
  focus: string | null;
  onToggle: (id: string | null) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
      {skillGroups.map((g) => {
        const active = focus === g.id;
        return (
          <button
            key={g.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(active ? null : g.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              padding: '6px 11px',
              borderRadius: 5,
              cursor: 'pointer',
              color: g.color,
              background: active ? `${g.color}33` : `${g.color}14`,
              border: `1px solid ${g.color}55`,
              transition: 'background 0.18s',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
            {g.label}
            <span style={{ opacity: 0.55 }}>{GROUP_COUNTS[g.id] ?? 0}</span>
          </button>
        );
      })}
      {focus !== null && (
        <button
          type="button"
          onClick={() => onToggle(null)}
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            padding: '6px 11px',
            borderRadius: 5,
            cursor: 'pointer',
            color: 'var(--text2)',
            background: 'transparent',
            border: '1px solid var(--bd2)',
          }}
        >
          Show all
        </button>
      )}
    </div>
  );
}
