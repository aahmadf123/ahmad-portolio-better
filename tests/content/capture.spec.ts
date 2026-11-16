import { test } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { collectDataStrings, collectRenderedUnits, ROUTES, routeSlug } from './collect';

// Run ONCE against the pre-redesign site:  CAPTURE=1 npx playwright test tests/content/capture.spec.ts --project=desktop
const DIR = path.join(__dirname, 'baseline');

test.describe('capture content baseline', () => {
  test.skip(process.env.CAPTURE !== '1', 'baseline capture only runs with CAPTURE=1');
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'desktop only'));

  test('data strings', async () => {
    mkdirSync(DIR, { recursive: true });
    writeFileSync(path.join(DIR, 'data.json'), JSON.stringify(await collectDataStrings(), null, 1));
  });

  for (const route of ROUTES) {
    test(`route ${route}`, async ({ page }) => {
      mkdirSync(DIR, { recursive: true });
      const units = await collectRenderedUnits(page, route);
      writeFileSync(path.join(DIR, `${routeSlug(route)}.json`), JSON.stringify(units.sort(), null, 1));
    });
  }
});
