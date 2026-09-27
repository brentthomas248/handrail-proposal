import { expect, test } from '@playwright/test';

const tourGuidance =
  'The animated tour follows the complete proposal below. Choose Read normally or Skip to content for a standard document layout.';

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`tour overview explains complete reading at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const main = page.getByRole('main');
    expect(await main.ariaSnapshot()).toContain(tourGuidance);
    await expect(main.locator('.tour-guidance')).toHaveCount(1);

    await page
      .getByRole('button', { name: 'Read normally', exact: true })
      .click();
    await expect(main.locator('.tour-guidance')).toBeHidden();
    expect(await main.ariaSnapshot()).not.toContain(tourGuidance);
    await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('normal reading omits tour-only guidance', async ({ page }) => {
    await page.goto('./');
    const main = page.getByRole('main');
    await expect(main.locator('.tour-guidance')).toHaveCount(1);
    await expect(main.locator('.tour-guidance')).toBeHidden();
    expect(await main.ariaSnapshot()).not.toContain(tourGuidance);
    await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

for (const route of ['./', './agreement/', './resume/']) {
  test(`external links announce the new tab on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('#new-tab-description')).toHaveCount(1);
    await expect(page.locator('#new-tab-description')).toBeHidden();
    const links = page.locator('a[target="_blank"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      await expect(link).toHaveAccessibleDescription('Opens in a new tab.');
    }
    await expect(
      page.locator('.portfolio-navigation').getByRole('link', {
        name: 'Explore my GitHub',
        exact: true,
      }),
    ).toHaveCount(1);
  });
}
