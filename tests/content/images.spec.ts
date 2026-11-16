import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { collectImages, ROUTES, routeSlug } from './collect';

// Every picture on the pre-redesign site must still be shown somewhere on the same page.
// Baseline captured once from the live (pre-redesign) site:
//   CAPTURE_IMAGES=https://www.ahmadfx.xyz npx playwright test tests/content/images.spec.ts --project=desktop
const FILE = path.join(__dirname, 'baseline', 'images.json');

test.describe('no picture is lost', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'desktop only'));

  if (process.env.CAPTURE_IMAGES) {
    test('capture image baseline', async ({ page }) => {
      test.setTimeout(600_000);
      const out: Record<string, string[]> = {};
      for (const r of ROUTES) out[routeSlug(r)] = await collectImages(page, r, process.env.CAPTURE_IMAGES);
      mkdirSync(path.dirname(FILE), { recursive: true });
      writeFileSync(FILE, JSON.stringify(out, null, 1));
    });
    return;
  }

  const baseline: Record<string, string[]> = JSON.parse(readFileSync(FILE, 'utf8'));
  for (const route of ROUTES) {
    test(`every picture survives on ${route}`, async ({ page }) => {
      const now = new Set(await collectImages(page, route));
      const missing = (baseline[routeSlug(route)] ?? []).filter((s) => !now.has(s));
      expect(missing, `pictures missing on ${route}`).toEqual([]);
    });
  }
});
