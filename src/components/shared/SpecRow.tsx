import React from 'react';

/**
 * One line of a spec sheet: what it is on the left, the number on the right, a dotted
 * leader between them. Used instead of boxed "stat cards" everywhere numbers appear.
 * `color` (hex) tints the number via the accent ink; the row itself stays plain.
 */
export function SpecRow({ value, label, color }: { value: React.ReactNode; label: string; color?: string }) {
  return (
    <div className="spec-row" style={color ? ({ '--area': color } as React.CSSProperties) : undefined}>
      <dt>{label}</dt>
      <span aria-hidden className="spec-leader" />
      <dd className="tnum">{value}</dd>
    </div>
  );
}
