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

test('hero actions: View projects first and primary, Download resume second', async ({ page }) => {
  await page.goto('/');
  const ctas = page.locator('#hero .opening-ctas a');
  await expect(ctas).toHaveText(['View projects', 'Download resume', 'View Work', 'Degree ↓']);
  await expect(ctas.nth(0)).toHaveAttribute('href', '/projects');
  await expect(ctas.nth(0)).toHaveClass(/hero-btn-primary/);
  await expect(ctas.nth(1)).toHaveAttribute('href', site.resumeUrl);
  await expect(ctas.nth(3)).toHaveAttribute('href', site.degreeUrl);
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

test('the Toledo prologue is its own block, below all of the hero', async ({ page }) => {
  await page.goto('/');
  const story = page.getByTestId('opening-story');
  // In normal flow: fully opaque, never layered over the hero, and nothing pinned.
  expect(await story.evaluate(seenOpacity)).toBeGreaterThan(0.99);
  const [heroBottom, prologueTop] = await page.evaluate(() => [
    document.querySelector('#hero')!.getBoundingClientRect().bottom,
    document.querySelector('#prologue')!.getBoundingClientRect().top,
  ]);
  expect(prologueTop).toBeGreaterThanOrEqual(heroBottom);
  await expect(page.locator('#hero [data-pinned], #prologue [data-pinned]')).toHaveCount(0);
  await story.scrollIntoViewIfNeeded();
  await expect(story.getByText(opening.title)).toBeVisible();
});

for (const width of [160, 200, 320, 390]) {
  // 160 and 200 stand in for a 320 / 400px phone at 200% text zoom.
  test(`hero name, description, buttons and credentials stay separate at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'viewport set explicitly');
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const clashes = await page.evaluate(() => {
      const panel = document.querySelector('#hero .hero-panel')!;
      const parts = [panel.querySelector('.hero-roles'), panel.querySelector('h1'), panel.querySelector('.opening-sub'), ...panel.querySelectorAll('.opening-ctas a'), ...panel.querySelectorAll('.opening-facts > div')]
        .map((el) => ({ el: el!, r: el!.getBoundingClientRect() }));
      const out: string[] = [];
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const [a, b] = [parts[i].r, parts[j].r];
        if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) out.push(`${parts[i].el.textContent} / ${parts[j].el.textContent}`);
      }
      const hero = document.querySelector('#hero')!.getBoundingClientRect();
      for (const p of parts) if (p.r.bottom > hero.bottom + 0.5 || p.r.right > innerWidth + 0.5) out.push(`${p.el.textContent} outside the hero`);
      return out;
    });
    expect(clashes).toEqual([]);
  });
}

test('reduced motion is still', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced project only');
  await page.goto('/');
  await expect(page.getByTestId('opening-story')).toBeVisible();
  // Polled: right after hydration the still layout replaces the server-rendered one.
  await expect.poll(() => page.locator('#prologue .flyin-photo').evaluateAll((els) => els.map((e) => getComputedStyle(e).transform))).toEqual(['none']);
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
    // Polled, so a transient re-render right after hydration can't fail it; a real
    // overlap persists and still fails.
    await expect.poll(() => page.locator('#hero dl > div').evaluateAll((els) => els.filter((e) => {
      const r = e.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
      return !hit || !e.contains(hit);
    }).map((e) => {
      const r = e.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
      return `${e.textContent} ← covered by ${hit?.tagName}.${hit?.className} in ${hit?.parentElement?.tagName}.${hit?.parentElement?.className}`;
    })), { timeout: 4000 }).toEqual([]);
    // The prologue's words fit one screen too, once scrolled to.
    const storyHeight = await page.getByTestId('opening-story').evaluate((e) => e.getBoundingClientRect().height);
    expect(storyHeight).toBeLessThanOrEqual(vp.height);
  });
}

test('a scene that loads mid-scroll is not frozen', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier has no scroll choreography');
  // One scroll, as early as possible, then hands off: like a refresh or back-navigation
  // landing mid-journey. The scene must catch up without any further scroll events.
  await page.goto('/');
  await page.evaluate(() => {
    const s = document.querySelector('[data-scene="chem-e-car"]') as HTMLElement;
    window.scrollTo({ top: s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * 0.85, behavior: 'instant' });
  });
  await expect.poll(() => page.getByTestId('world-copy-chem-e-car').evaluate(seenOpacity), { timeout: 5000 }).toBeGreaterThan(0.95);
});
