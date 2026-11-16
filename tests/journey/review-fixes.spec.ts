import { test, expect, type Page } from '@playwright/test';
import { worlds } from '../../src/lib/data/worlds';
import { heroFacts } from '../../src/lib/data/site';

// Findings from the final whole-branch review: each test reproduces one.

const seenOpacity = (el: Element) => {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
};
const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'desktop only');

async function openCaseStudyFromCard(page: Page, world: string, title: string) {
  const card = page.locator(`#${world}`).getByRole('button', { name: `${title} - open project details` });
  await expect(async () => {
    await card.scrollIntoViewIfNeeded({ timeout: 2000 });
    await card.click({ timeout: 2000 });
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 2000 });
  }).toPass();
  await page.getByRole('dialog').getByRole('link', { name: /case study/i }).first().click();
  await expect(page).toHaveURL(/case-study/);
}

test('Back after an in-page link click returns to the homepage', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.locator('#hero').getByRole('link', { name: 'Start the journey ↓' }).click();
  await expect(page).toHaveURL(/#chem-e-car$/);
  await openCaseStudyFromCard(page, 'ai-engineering', 'DeepTruth');
  await page.goBack();
  await expect(page).toHaveURL(/\/#chem-e-car$/);
  await expect(page.locator('#chem-e-car')).toBeAttached({ timeout: 8000 });
});

for (const w of worlds) {
  test(`/#${w.id} lands on its own photo with its words showing`, async ({ page }, info) => {
    test.skip(info.project.name === 'reduced', 'still tier: plain stacked sections');
    await page.goto(`/#${w.id}`);
    await expect.poll(() => page.getByTestId(`world-copy-${w.id}`).evaluate(seenOpacity), { timeout: 6000 }).toBeGreaterThan(0.95);
    const own = page.locator(`[data-scene="${w.id}"] .flyin-photo[data-photo="${w.photo}"]`);
    await expect.poll(() => own.evaluate((e) => Number(getComputedStyle(e).opacity))).toBeGreaterThan(0.95);
  });
}

test('/#projects and "View Work" land on the work, not a bare photo', async ({ page }, info) => {
  desktopOnly(info.project.name);
  const inView = (sel: string) => page.locator(sel).evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= -2 && r.top < innerHeight * 0.5; });
  await page.goto('/#projects');
  await expect.poll(() => inView(`#${worlds[0].id}-work`), { timeout: 6000 }).toBe(true);
  await page.goto('/');
  await page.locator('#hero').getByRole('link', { name: 'View Work' }).click();
  await expect.poll(() => inView(`#${worlds[0].id}-work`), { timeout: 6000 }).toBe(true);
});

test('Shift+Tab back into the opening never focuses an invisible button', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.locator(`#${worlds[0].id}`).getByRole('button', { name: /open project details/ }).first().focus();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Shift+Tab');
    const inHero = await page.evaluate(() => !!document.getElementById('hero')?.contains(document.activeElement));
    if (inHero) break;
  }
  await page.waitForTimeout(250);
  const s = await page.evaluate((fn) => {
    const el = document.activeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    return { inHero: !!document.getElementById('hero')?.contains(el), seen: (new Function(`return (${fn})`)())(el) as number, top: r.top, bottom: r.bottom, h: innerHeight };
  }, seenOpacity.toString());
  expect(s.inHero).toBe(true);
  expect(s.seen).toBeGreaterThan(0.95);
  expect(s.top).toBeGreaterThanOrEqual(0);
  expect(s.bottom).toBeLessThanOrEqual(s.h);
});

for (const vp of [{ width: 360, height: 640 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 667, height: 375 }]) {
  test(`every hero fact can be read on a ${vp.width}x${vp.height} phone`, async ({ page }, info) => {
    desktopOnly(info.project.name);
    await page.setViewportSize(vp);
    await page.goto('/');
    await page.waitForTimeout(500);
    for (const f of heroFacts) {
      const fact = page.locator('#hero dl > div').filter({ hasText: f.value }).first();
      await fact.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const s = await fact.evaluate((e, fn) => {
        const r = e.getBoundingClientRect();
        return { seen: (new Function(`return (${fn})`)())(e) as number, top: r.top, bottom: r.bottom, h: innerHeight };
      }, seenOpacity.toString());
      expect(s.seen, f.label).toBeGreaterThan(0.95);
      expect(s.top, f.label).toBeGreaterThanOrEqual(0);
      expect(s.bottom, f.label).toBeLessThanOrEqual(s.h);
    }
  });
}

test('Chem-E Car world is dated to the 2025 competition season', async () => {
  expect(worlds.find((w) => w.id === 'chem-e-car')!.years).toBe('2025');
});

test('photo credits say the photos were modified (CC BY-SA)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('graded and resized');
});
