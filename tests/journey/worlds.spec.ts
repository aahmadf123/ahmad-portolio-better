import { test, expect, type Page } from '@playwright/test';
import { worlds, worldForProject, worldForInsight } from '../../src/lib/data/worlds';
import { projects, flagshipProject } from '../../src/lib/data/projects';
import { insights } from '../../src/lib/data/insights';

const seenOpacity = (el: Element) => {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
};

async function scrollToScene(page: Page, id: string, frac: number) {
  await page.evaluate(([id, f]) => {
    const s = document.querySelector(`[data-scene="${id}"]`) as HTMLElement;
    const top = s.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + (s.offsetHeight - innerHeight) * (f as number), behavior: 'instant' });
  }, [id, frac] as const);
}

test('five worlds in order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
  const order = worlds.map((w) => w.id).map((id) => ids.indexOf(id));
  expect(order.every((i) => i >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
  expect(ids.indexOf('hero')).toBeLessThan(order[0]);
  expect(ids.indexOf('next-chapter')).toBeGreaterThan(order[order.length - 1]);
});

test('every project is in its world', async ({ page }) => {
  await page.goto('/');
  for (const p of projects.filter((p) => p.slug)) {
    const world = page.locator(`#${worldForProject(p.slug!)}`);
    if (p === flagshipProject) await expect(world.getByText(p.title, { exact: false }).first()).toBeAttached();
    else await expect(world.getByRole('button', { name: `${p.title} - open project details` })).toBeAttached();
  }
});

test('a world card opens the project details', async ({ page }, info) => {
  test.skip(info.project.name === 'phone', 'covered on desktop; phone taps the same button');
  await page.goto('/');
  const card = page.locator('#ai-engineering').getByRole('button', { name: 'DeepTruth - open project details' });
  // Retry through the one re-render right after hydration (tier switch).
  await expect(async () => {
    await card.scrollIntoViewIfNeeded({ timeout: 2000 });
    await card.click({ timeout: 2000 });
    await expect(page.getByRole('dialog')).toContainText('DeepTruth', { timeout: 2000 });
  }).toPass();
});

test('play diagram survives in sports analytics', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sports-analytics svg[aria-label="Animated football play diagram"]')).toBeAttached();
});

test('research paper lives in the research world', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#research').getByText('Taxonomy for', { exact: false }).first()).toBeAttached();
});

test('insights land in their worlds', async ({ page }) => {
  await page.goto('/');
  for (const w of worlds) {
    const expected = insights.filter((i) => worldForInsight(i) === w.id).map((i) => i.id).sort();
    const got = await page.locator(`#${w.id} [data-insight]`).evaluateAll((els) => els.map((e) => e.getAttribute('data-insight')!).sort());
    expect(got, w.id).toEqual(expected);
  }
});

for (const id of ['story', 'projects', 'insights', 'research', 'about', 'skills', 'timeline', 'credentials', 'field-notes', 'signals', 'now', 'contact']) {
  test(`legacy anchor #${id} resolves`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'desktop only');
    await page.goto(`/#${id}`);
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    // World links (and the old #story) land where that world's words are showing;
    // everything else lands with its top at the top of the screen.
    const world = id === 'story' ? worlds[0].id : worlds.find((w) => w.id === id)?.id;
    if (world) {
      await expect.poll(() => page.getByTestId(`world-copy-${world}`).evaluate(seenOpacity), { timeout: 5000 }).toBeGreaterThan(0.95);
    } else {
      await expect.poll(async () => Math.abs(await page.locator(`[id="${id}"]`).evaluate((e) => e.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(140);
    }
  });
}

test('world copy fits the screen and shows on scroll', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier stacks copy in the flow');
  for (const vp of [{ width: 360, height: 740 }, { width: 1280, height: 720 }]) {
    await page.setViewportSize(vp);
    await page.goto('/');
    for (const w of worlds) {
      await scrollToScene(page, w.id, 0.92);
      const copy = page.getByTestId(`world-copy-${w.id}`);
      await expect.poll(() => copy.evaluate(seenOpacity), { message: `${w.id} copy visible` }).toBeGreaterThan(0.95);
      const box = await copy.evaluate((e) => e.getBoundingClientRect().toJSON());
      expect(box.bottom, `${w.id} at ${vp.width}x${vp.height}`).toBeLessThanOrEqual(vp.height);
      expect(box.top, `${w.id} at ${vp.width}x${vp.height}`).toBeGreaterThanOrEqual(0);
    }
  }
});

test('keyboard focus inside a world is visible', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  // Focus the last tabbable element before #research, then Tab into the world.
  await page.evaluate(() => {
    const sel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';
    const all = [...document.querySelectorAll<HTMLElement>(sel)].filter((e) => !e.closest('[inert]'));
    const research = document.getElementById('research')!;
    const first = all.findIndex((e) => research.contains(e));
    // A keyboard user reaching this element would already have it on screen.
    all[first - 1].scrollIntoView({ block: 'center', behavior: 'instant' });
    all[first - 1].focus({ preventScroll: true });
  });
  await page.keyboard.press('Tab');
  // The site scrolls smoothly, so the jump to the focused card takes a moment.
  await expect.poll(() => page.evaluate(() => {
    const r = (document.activeElement as HTMLElement).getBoundingClientRect();
    return r.top >= -1 && r.bottom <= innerHeight + 1; // 1px for sub-pixel rounding
  }), { timeout: 4000 }).toBe(true);
  const state = await page.evaluate((fn) => {
    const el = document.activeElement as HTMLElement;
    const seen = new Function(`return (${fn})`)()(el) as number;
    const r = el.getBoundingClientRect();
    return { inResearch: !!document.getElementById('research')?.contains(el), seen, top: r.top, bottom: r.bottom, h: innerHeight };
  }, seenOpacity.toString());
  expect(state.inResearch).toBe(true);
  expect(state.seen).toBeGreaterThan(0.95);
  expect(state.top).toBeGreaterThanOrEqual(-1);
  expect(state.bottom).toBeLessThanOrEqual(state.h + 1);
});

test('header nav: Journey, Notes, About, Contact + Docs', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop header only');
  await page.goto('/');
  const labels = await page.locator('header nav a[href^="#"]').evaluateAll((els) => els.map((e) => e.textContent?.trim()).filter((t) => t !== 'Ahmad.dev'));
  expect(labels).toEqual(['Journey', 'Notes', 'About', 'Contact']);
  await expect(page.locator('header a[href="/docs"]').first()).toBeVisible();
});

test('opening hands over to the first world without a seam', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier has no sticky stages');
  await page.goto('/');
  for (const extra of [1, 40, 200]) {
    const stage = await page.evaluate((extra) => {
      const open = document.querySelector('[data-scene="opening"]') as HTMLElement;
      const end = open.getBoundingClientRect().top + scrollY + open.offsetHeight - innerHeight;
      window.scrollTo({ top: end + extra, behavior: 'instant' });
      const st = (document.querySelector('[data-scene="chem-e-car"]') as HTMLElement).firstElementChild as HTMLElement;
      const r = st.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, h: innerHeight };
    }, extra);
    expect(Math.abs(stage.top), `stage top ${extra}px past the opening`).toBeLessThanOrEqual(1);
    expect(stage.bottom).toBeGreaterThanOrEqual(stage.h - 1);
  }
});

test('the opening is gone before the first world changes', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced', 'still tier has no sticky stages');
  await page.goto('/');
  // Wherever the first world shows anything but the opening photo at 1x, the opening
  // stage must already be fully off screen.
  const res = await page.evaluate(async () => {
    const open = document.querySelector('[data-scene="opening"]') as HTMLElement;
    const chem = document.querySelector('[data-scene="chem-e-car"]') as HTMLElement;
    const openStage = open.firstElementChild as HTMLElement;
    const fromLayer = chem.querySelectorAll('.flyin-photo')[1] as HTMLElement; // the `from` layer
    const start = chem.getBoundingClientRect().top + scrollY;
    const bad: number[] = [];
    for (let y = start; y < start + chem.offsetHeight; y += 40) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const changed = fromLayer.style.transform && fromLayer.style.transform !== 'scale(1)';
      if (changed && openStage.getBoundingClientRect().bottom > 1) bad.push(Math.round(y - start));
    }
    return bad;
  });
  expect(res).toEqual([]);
});
