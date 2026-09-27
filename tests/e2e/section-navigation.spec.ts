import { expect, test } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

for (const width of [390, 1440]) {
  test(`a shared section URL opens the requested tour chapter at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./#window');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await waitForTourSettled(page);
    await expect(
      page.getByRole('button', { name: 'The window', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('#tour-caption')).toHaveText('The window');
    await page.evaluate(() => {
      location.hash = 'cash-flow';
    });
    await waitForTourSettled(page);
    await expect(
      page.getByRole('button', { name: 'Cash flow', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
  });
}

for (const width of [320, 390]) {
  test(`tabbed chapter labels are immediately visible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const buttons = page.locator('.chapter-nav button');
    await buttons.first().focus();
    for (let index = 0; index < (await buttons.count()); index += 1) {
      if (index) await page.keyboard.press('Tab');
      await expect(buttons.nth(index)).toBeFocused();
      const frame = await buttons.nth(index).evaluate((button) => {
        const nav = button.closest('.chapter-nav')!;
        const b = button.getBoundingClientRect(),
          n = nav.getBoundingClientRect();
        return {
          left: b.left - n.left,
          right: n.right - b.right,
          mask: getComputedStyle(nav).maskImage,
        };
      });
      expect(frame.left).toBeGreaterThanOrEqual(-1);
      expect(frame.right).toBeGreaterThanOrEqual(-1);
      expect(frame.mask).toBe('none');
    }
  });
  for (const route of ['./?view=read', './agreement/', './resume/']) {
    test(`secondary document links have comfortable targets on ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      const targets = page.locator('.site-footer a, .reading-navigation a');
      for (const target of await targets.all()) {
        if (!(await target.isVisible())) continue;
        const box = await target.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(24);
      }
    });
  }
}
