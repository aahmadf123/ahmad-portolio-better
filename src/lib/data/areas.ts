// One colour per area of work, used everywhere that area shows up (hero nodes, work
// groups, story chapters, timeline). Taken from each world's accent, so there is a
// single source. Colours are markers (dots, rules, tints); as text they go through
// accentInk() so they stay readable on paper and at night.
import { worlds, type WorldId } from './worlds';

export const AREA_COLORS = Object.fromEntries(worlds.map((w) => [w.id, w.accent])) as Record<WorldId, string>;
