// Chapter registry - single source of truth for section order, numbering, accent
// colors, header links, and the ChapterNav dot rail.

import { worlds } from './worlds';

export interface SectionDef {
  id: string;
  /** Two-digit chapter number shown as the ghost numeral (empty for hero). */
  n: string;
  label: string;
  color: string;
  /** Show in the header pill nav (ChapterNav shows all). */
  nav: boolean;
}

/**
 * The pre-journey chapter list (before the 2026-11 photo-journey redesign). Kept
 * unchanged as part of the content record; nothing renders from it any more.
 */
export const legacySections: SectionDef[] = [
  { id: 'hero', n: '', label: 'Prologue', color: '#2dd4bf', nav: false },
  { id: 'story', n: '01', label: 'The Story', color: '#2dd4bf', nav: true },
  { id: 'about', n: '02', label: 'About', color: '#38bdf8', nav: true },
  { id: 'skills', n: '03', label: 'Capabilities', color: '#f472b6', nav: false },
  { id: 'timeline', n: '04', label: 'Timeline', color: '#a78bfa', nav: false },
  { id: 'projects', n: '05', label: 'Work', color: '#fb7185', nav: true },
  { id: 'research', n: '06', label: 'Research', color: '#5b8af5', nav: false },
  { id: 'credentials', n: '07', label: 'Credentials', color: '#e5c453', nav: false },
  { id: 'field-notes', n: '08', label: 'Field Notes', color: '#2dd4bf', nav: true },
  { id: 'signals', n: '09', label: 'Signals', color: '#a78bfa', nav: false },
  { id: 'insights', n: '10', label: 'Insights', color: '#22c55e', nav: false },
  { id: 'now', n: '11', label: 'Now', color: '#2dd4bf', nav: false },
  { id: 'contact', n: '12', label: 'Contact', color: '#38bdf8', nav: true },
];

/** The live registry: the photo journey's five worlds, then the calmer sections. */
export const sections: SectionDef[] = [
  { id: 'hero', n: '', label: 'Prologue', color: '#2dd4bf', nav: false },
  ...worlds.map((w) => ({ id: w.id, n: w.n, label: w.label, color: w.accent, nav: w.id === 'chem-e-car' })),
  { id: 'next-chapter', n: '06', label: 'The Next Chapter', color: '#2dd4bf', nav: false },
  { id: 'field-notes', n: '07', label: 'Field Notes', color: '#2dd4bf', nav: true },
  { id: 'about', n: '08', label: 'About', color: '#38bdf8', nav: true },
  { id: 'skills', n: '09', label: 'Capabilities', color: '#f472b6', nav: false },
  { id: 'timeline', n: '10', label: 'Timeline', color: '#a78bfa', nav: false },
  { id: 'credentials', n: '11', label: 'Credentials', color: '#e5c453', nav: false },
  { id: 'signals', n: '12', label: 'Signals', color: '#a78bfa', nav: false },
  { id: 'now', n: '13', label: 'Now', color: '#2dd4bf', nav: false },
  { id: 'contact', n: '14', label: 'Contact', color: '#38bdf8', nav: true },
];

export const navSections = sections.filter((s) => s.nav);

export function sectionById(id: string): SectionDef | undefined {
  return sections.find((s) => s.id === id) ?? legacySections.find((s) => s.id === id);
}

