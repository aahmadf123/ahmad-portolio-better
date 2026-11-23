import { test, expect } from '@playwright/test';

const notePath = '/field-notes/agentic-ai-in-production';

test('the full return label does not overlap the article category on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto(notePath);
  const link = page.getByRole('link', { name: 'All Field Notes', exact: true }).first();
  await expect(link).toBeVisible();
  const linkBox = await link.boundingBox();
  const categoryBox = await page.locator('.subpage-right').boundingBox();
  expect(linkBox).not.toBeNull();
  expect(categoryBox).not.toBeNull();
  expect(linkBox!.x + linkBox!.width).toBeLessThanOrEqual(categoryBox!.x);
});

for (const position of ['header', 'footer'] as const) {
  for (const origin of ['/', '/field-notes', 'direct'] as const) {
    test(`${position} All Field Notes opens the notes index from ${origin}`, async ({ page }) => {
      if (origin === 'direct') {
        await page.goto(notePath);
      } else {
        await page.goto(origin);
        await page.locator(`a[href="${notePath}"]`).first().click();
        await expect(page).toHaveURL(notePath);
        await expect.poll(() => page.evaluate(() => sessionStorage.getItem('nav:prev'))).toBe(origin);
      }

      const links = page.getByRole('link', { name: 'All Field Notes', exact: true });
      await expect(links).toHaveCount(2);
      const link = position === 'header' ? links.first() : links.last();
      await expect(link).toHaveAttribute('href', '/field-notes');
      await link.click();
      await expect(page).toHaveURL('/field-notes');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Essays from');
    });
  }
}
