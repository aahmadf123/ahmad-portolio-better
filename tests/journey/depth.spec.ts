import { test, expect, type Page } from '@playwright/test';

const IGNORED = /Failed to load resource|_vercel\/insights/;

async function scrollToScene(page: Page, id: string, frac: number) {
  await page.evaluate(([id, f]) => {
    const s = document.querySelector(`[data-scene="${id}"]`) as HTMLElement;
    const top = s.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + (s.offsetHeight - innerHeight) * (f as number), behavior: 'instant' });
  }, [id, frac] as const);
}

test('desktop gets exactly one depth canvas, and it takes over the photos', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  await expect(page.locator('canvas[data-journey-canvas]')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.depthReady ?? ''), { timeout: 10000 }).toContain('opening');
  await expect(page.locator('#hero .flyin-photo').first()).toHaveCSS('visibility', 'hidden');
});

test('the canvas draws the photo', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/?testcanvas');
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.depthReady ?? ''), { timeout: 10000 }).toContain('data-science');
  await scrollToScene(page, 'data-science', 0.9);
  await page.waitForTimeout(400);
  const lum = await page.evaluate(async () => {
    const c = document.querySelector('canvas[data-journey-canvas]') as HTMLCanvasElement;
    const img = new Image();
    img.src = c.toDataURL();
    await img.decode();
    const k = document.createElement('canvas');
    k.width = img.width; k.height = img.height;
    const g = k.getContext('2d')!;
    g.drawImage(img, 0, 0);
    // Average luminance over a grid of points (the photo is a night city; not pure black).
    let sum = 0, n = 0;
    for (let y = 0.2; y < 0.9; y += 0.1) for (let x = 0.55; x < 0.95; x += 0.1) {
      const [r, gg, b] = g.getImageData(Math.floor(k.width * x), Math.floor(k.height * y), 1, 1).data;
      sum += 0.2126 * r + 0.7152 * gg + 0.0722 * b; n++;
    }
    return sum / n;
  });
  expect(lum).toBeGreaterThan(12);
});

test('phones and reduced motion get no canvas', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'phone and reduced only');
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('canvas[data-journey-canvas]')).toHaveCount(0);
  await expect(page.locator('#hero .flyin-photo').first()).toHaveCSS('visibility', 'visible');
});

test('canvas failure falls back to css photos', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(m.text()); });
  await page.route('**/*-depth.webp', (r) => r.abort());
  await page.goto('/');
  await page.waitForTimeout(3000);
  expect(await page.evaluate(() => document.documentElement.dataset.depthReady ?? '')).toBe('');
  await expect(page.locator('#hero .flyin-photo').first()).toHaveCSS('visibility', 'visible');
  expect(errors).toEqual([]);
});

test('resize desktop to phone mid-journey', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  await scrollToScene(page, 'research', 0.9);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await expect(page.locator('canvas[data-journey-canvas]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await scrollToScene(page, 'research', 0.95);
  await expect(page.locator('#research-title')).toBeVisible();
  await expect(page.locator('[data-scene="research"] .flyin-photo').first()).toHaveCSS('visibility', 'visible');
});

test('no console errors over a full scroll', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});
