import { test, expect } from '@playwright/test';
import { site, heroFacts } from '../../src/lib/data/site';
import { opening } from '../../src/lib/data/worlds';

const HEADSHOT = 'button[aria-label="Enlarge photo of Ahmad Firas"]';

/** Opacity as the viewer sees it: the product of the element's and all its ancestors'. */
const seenOpacity = (el: Element) => {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
};

test('opening renders name, facts, ctas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero h1')).toHaveText(/Ahmad\s*Firas/);
  for (const f of heroFacts) await expect(page.locator('#hero').getByText(f.value, { exact: true }).first()).toBeAttached();
  await expect(page.locator(`#hero a[href="${site.resumeUrl}"]`)).toHaveCount(1);
  await expect(page.locator(`#hero a[href="${site.degreeUrl}"]`)).toHaveCount(1);
});

test('opening photo is the LCP image', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('#hero picture img').first();
  await expect(img).toHaveAttribute('fetchpriority', 'high');
  await expect(img).toHaveAttribute('srcset', /opening-1280\.webp/);
});

test('headshot lives in About', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(`#hero ${HEADSHOT}`)).toHaveCount(0);
  const shot = page.locator(`#about ${HEADSHOT}`);
  // The page re-renders once after hydration (tier switch), so retry the scroll.
  await expect(async () => {
    await shot.scrollIntoViewIfNeeded({ timeout: 2000 });
    await expect(shot).toBeVisible({ timeout: 1000 });
  }).toPass();
});

test('fly-in reveals the Toledo story on scroll', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier has no scroll choreography');
  await page.goto('/');
  const story = page.getByTestId('opening-story');
  // Before scrolling, the Toledo block is still hidden behind the name.
  expect(await story.evaluate(seenOpacity)).toBeLessThan(0.2);
  // Re-apply the scroll inside the poll: the site's scroll restoration can reset an
  // early scroll made before hydration.
  await expect.poll(async () => {
    await page.evaluate(() => {
      const s = document.querySelector('[data-scene="opening"]') as HTMLElement;
      window.scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * 0.85, behavior: 'instant' });
    });
    return story.evaluate(seenOpacity);
  }).toBeGreaterThan(0.95);
  await expect(story.getByText(opening.title)).toBeVisible();
});

test('reduced motion is still', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced project only');
  await page.goto('/');
  await expect(page.getByTestId('opening-story')).toBeVisible();
  const transforms = await page.locator('#hero .flyin-photo').evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
  expect(transforms.length).toBeGreaterThan(0);
  for (const t of transforms) expect(t).toBe('none');
});

for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }, { width: 1280, height: 720 }, { width: 1440, height: 900 }]) {
  test(`opening copy fits a ${vp.width}x${vp.height} screen`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'viewport set explicitly');
    await page.setViewportSize(vp);
    await page.goto('/');
    // The Now Building bar mounts after hydration on screens wider than 900px; wait for it.
    if (vp.width > 900) await page.locator('aside[aria-label="Now building"]').waitFor();
    // Every hero fact must be on screen, not clipped by the sticky stage.
    const bottoms = await page.locator('#hero dl > div').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().bottom));
    expect(bottoms.length).toBeGreaterThan(0);
    for (const b of bottoms) expect(b).toBeLessThanOrEqual(vp.height);
    // ...and not hidden under floating chrome (the Now Building bar, the chat pill).
    const covered = await page.locator('#hero dl > div').evaluateAll((els) => els.filter((e) => {
      const r = e.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
      return !hit || !e.contains(hit);
    }).map((e) => e.textContent));
    expect(covered).toEqual([]);
    const storyBottom = await page.evaluate(() => {
      const s = document.querySelector('[data-scene="opening"]') as HTMLElement;
      window.scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * 0.9, behavior: 'instant' });
      return new Promise<number>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(document.querySelector('[data-testid="opening-story"]')!.getBoundingClientRect().bottom))));
    });
    expect(storyBottom).toBeLessThanOrEqual(vp.height);
  });
}

test('a scene that loads mid-scroll is not frozen', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier has no scroll choreography');
  // One scroll, as early as possible, then hands off: like a refresh or back-navigation
  // landing mid-journey. The scene must catch up without any further scroll events.
  await page.goto('/');
  await page.evaluate(() => {
    const s = document.querySelector('[data-scene="opening"]') as HTMLElement;
    window.scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * 0.85, behavior: 'instant' });
  });
  await expect.poll(() => page.getByTestId('opening-story').evaluate(seenOpacity), { timeout: 5000 }).toBeGreaterThan(0.95);
});
