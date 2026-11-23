import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES } from '../content/collect';

const WIDTHS = [320, 375, 430, 768, 1024, 1280, 1920, 2560];

test.describe('every route at every width', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'widths set explicitly'));

  for (const route of [...ROUTES, '/projects']) {
    test(`no horizontal overflow on ${route}`, async ({ page }) => {
      test.setTimeout(300_000); // eight widths, each a full load and scroll
      const bad: string[] = [];
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 900) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise((r) => setTimeout(r, 25));
          }
        });
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        if (sw > width) bad.push(`${width}px → scrollWidth ${sw}`);
      }
      expect(bad).toEqual([]);
    });
  }

  const AXE_ROUTES = ['/', '/projects', '/case-study/toledo-football-iq-computer-vision-analytics', '/field-notes/battle-of-i75-coin-toss', '/field-notes', '/docs'];
  for (const theme of ['light', 'dark'] as const) for (const route of AXE_ROUTES) {
    test(`axe (${theme}): no serious or critical issues on ${route}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await page.waitForTimeout(800);
      const res = await new AxeBuilder({ page: page as never }).analyze();
      const bad = res.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .flatMap((v) => v.nodes.filter((n) => !n.html.includes('aria-hidden')).map((n) => `${v.id}: ${n.html.slice(0, 100)}`));
      expect(bad).toEqual([]);
    });
  }
});
