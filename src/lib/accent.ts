/**
 * An accent as text or a line: mixed toward the ink so it reads on paper and on night.
 * Accents themselves are only used as small markers (a dot, a 1px rule).
 */
export const accentInk = (c: string) => `color-mix(in oklab, ${c} var(--accent-mix), var(--foreground))`;
