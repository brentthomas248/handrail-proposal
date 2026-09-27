import { expect, test } from '@playwright/test';

for (const width of [320, 359, 360, 390]) {
  for (const spaced of [false, true]) {
    test(`notes comparison rates align at ${width}px with ${spaced ? 'user spacing' : 'authored spacing'}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('./agreement/');
      await page.evaluate(() => document.fonts.ready);
      if (spaced) {
        await page.addStyleTag({
          content:
            '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }',
        });
      }
      const rates = page.locator('.collection-rate');
      await expect(rates).toHaveCount(2);
      const baselines = await rates.evaluateAll((elements) =>
        elements.map((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return [...range.getClientRects()].at(-1)!.bottom;
        }),
      );
      expect(
        Math.abs(baselines[0] - baselines[1]),
        'Both comparison percentages must share a text baseline',
      ).toBeLessThanOrEqual(1);
    });
  }
}
