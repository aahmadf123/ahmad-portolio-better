import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { collectDataStrings, loadAndCollectText, normalize, ROUTES, routeSlug, type AllowedRemoval } from './collect';
import { sentences } from '../../src/lib/data/story';

// Guards Ahmad's rule: the redesign may move content, never drop it.
const DIR = path.join(__dirname, 'baseline');
const read = <T,>(f: string): T => JSON.parse(readFileSync(path.join(DIR, f), 'utf8'));
const allowed: AllowedRemoval[] = JSON.parse(readFileSync(path.join(__dirname, 'allowed-removals.json'), 'utf8'));
const allowedSet = new Set(allowed.map((a) => normalize(a.text)));

test.describe('no information loss', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'desktop only'));

  test('data strings survive', async () => {
    const now = new Set(await collectDataStrings());
    // Only edits Ahmad asked for, each recorded with its reason in allowed-removals.json.
    const missing = read<string[]>('data.json').filter((s) => !now.has(s) && !allowedSet.has(normalize(s)));
    expect(missing, `data strings removed or edited:\n${missing.join('\n')}`).toEqual([]);
  });

  for (const route of ROUTES) {
    test(`rendered text survives on ${route}`, async ({ page }) => {
      const text = normalize((await loadAndCollectText(page, route)).join(' '));
      // A paragraph the redesign split across places (e.g. one story chapter shared by two
      // worlds) still counts as present when every one of its sentences is on the page.
      const present = (u: string) => text.includes(u) || (sentences(u).length > 1 && sentences(u).every((s) => text.includes(normalize(s))));
      const missing = read<string[]>(`${routeSlug(route)}.json`).filter((u) => !allowedSet.has(u) && !present(u));
      expect(missing, `missing on ${route}:\n${missing.join('\n')}`).toEqual([]);
    });
  }

  test('allowed removals are honest', async ({ page }) => {
    for (const a of allowed) expect(a.reason?.trim(), `no reason for "${a.text}"`).toBeTruthy();
    // Numbers are usually facts: an entry with a digit must say where that fact now
    // shows (preservedAs), unless it is explicitly a UI label that states no fact.
    const withDigits = allowed.filter((a) => /\d/.test(a.text) && a.kind !== 'ui-label');
    for (const a of withDigits) expect(a.preservedAs, `"${a.text}" has a number but no preservedAs`).toBeTruthy();
    if (withDigits.length) {
      const home = normalize((await loadAndCollectText(page, '/')).join(' '));
      for (const a of withDigits) expect(home.includes(normalize(a.preservedAs!)), `preservedAs "${a.preservedAs}" not on /`).toBe(true);
    }
  });
});
