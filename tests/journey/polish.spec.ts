import { test, expect } from '@playwright/test';

// Ahmad's second review: solenoid line in the wrong world, hero should not be
// left-aligned, "open to collaborate" (he works full time), a glow cursor, gliding
// scroll, and no stalls while scrolling.

const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'desktop only');

test('the pressure/solenoid drawing belongs to the Chem-E Car, not Data Science', async ({ page }) => {
  await page.goto('/');
  const text = (id: string) => page.getByTestId(`stage-art-${id}`).evaluate((e) => e.textContent ?? '');
  test.skip((await page.getByTestId('stage-art-chem-e-car').count()) === 0, 'stage art not rendered');
  expect(await text('data-science')).not.toMatch(/solenoid|PSI/i);
  // A readable caption under the drawing, not text inside the artwork.
  expect(await text('chem-e-car')).not.toMatch(/solenoid/i);
  const caption = page.locator('#chem-e-car .stage-art-caption');
  await expect(caption).toHaveText('~5 PSI setpoint · solenoid cut');
  expect(await caption.evaluate((e) => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(14);
});

test('the hero name, buttons and facts are centred', async ({ page }) => {
  await page.goto('/');
  // Centred in the hero (on wide screens the chapter rail takes a column on the left).
  const hero = (await page.locator('#hero').boundingBox())!;
  const mid = hero.x + hero.width / 2;
  for (const sel of ['#hero-name', '.opening-ctas', '.opening-facts']) {
    await expect.poll(async () => {
      const box = await page.locator(sel).first().boundingBox();
      return box ? Math.abs(box.x + box.width / 2 - mid) : Infinity;
    }, { message: sel }).toBeLessThanOrEqual(24);
  }
  expect(await page.locator('#hero-name').evaluate((e) => getComputedStyle(e).textAlign)).toBe('center');
});

test('he is open to collaborate, not looking for work', async ({ page }) => {
  await page.goto('/');
  const body = await page.evaluate(() => document.body.innerText);
  expect(body).not.toMatch(/Open to roles|Available · Toledo|Full-Time Roles|Available for select projects|still open -/i);
  await expect(page.locator('#contact')).toContainText(/open to collaborat/i);
  await expect(page.locator('footer')).toContainText(/open to collaborat/i);
});

test('the cursor is the system cursor plus a glow that follows the mouse', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.documentElement.classList.contains('has-custom-cursor'))).toBe(false);
  expect(await page.evaluate(() => getComputedStyle(document.body).cursor)).not.toBe('none');
  expect(await page.evaluate(() => [...document.querySelectorAll('body > canvas')].some((c) => getComputedStyle(c).zIndex === '999999'))).toBe(false);
  const glow = page.locator('[data-cursor-glow]');
  await page.mouse.move(300, 300);
  await page.waitForTimeout(400);
  const a = await glow.evaluate((e) => getComputedStyle(e).translate);
  await page.mouse.move(900, 600, { steps: 4 });
  await page.waitForTimeout(600);
  const b = await glow.evaluate((e) => getComputedStyle(e).translate);
  expect(b).not.toBe(a);
  expect(await glow.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
});

test('no glow on touch screens', async ({ page }, info) => {
  test.skip(info.project.name !== 'phone', 'phone only');
  await page.goto('/');
  await page.waitForTimeout(500);
  const glow = page.locator('[data-cursor-glow]');
  expect((await glow.count()) === 0 || (await glow.evaluate((e) => getComputedStyle(e).display)) === 'none').toBe(true);
});

test('wheel scrolling glides instead of jumping', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(60);
  const mid = await page.evaluate(() => scrollY);
  await page.waitForTimeout(1500);
  const end = await page.evaluate(() => scrollY);
  expect(end).toBeGreaterThan(500);
  expect(mid, 'still easing toward the target').toBeLessThan(end - 20);
});

test('reduced motion keeps the browser’s own scrolling', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced', 'reduced only');
  await page.goto('/');
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
});

test('the page does not scroll behind an open project', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/#ai-engineering-work');
  const tile = page.locator('#ai-engineering-work').getByRole('button', { name: 'DeepTruth - open project details' });
  await expect(async () => { await tile.click({ timeout: 2000 }); await expect(page.getByRole('dialog')).toBeVisible({ timeout: 2000 }); }).toPass();
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(40, 450);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(900);
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(3);
});

test('scrolling the whole journey stays light: few DOM writes per scroll', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    (window as unknown as { __m: number }).__m = 0;
    new MutationObserver((ms) => { (window as unknown as { __m: number }).__m += ms.length; })
      .observe(document.body, { subtree: true, attributes: true, childList: true, characterData: true });
  });
  const end = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < end; y += 450) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }), y); await page.waitForTimeout(40); }
  await page.waitForTimeout(500);
  const n = await page.evaluate(() => (window as unknown as { __m: number }).__m);
  // Before this pass the same walk cost ~5,500 writes (frame-by-frame JS reveals, every
  // scene updating on every scroll); the session recorder pays for each one.
  expect(n).toBeLessThan(1500);
});
