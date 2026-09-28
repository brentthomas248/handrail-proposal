import { expect, test } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
]) {
  for (const path of [
    {
      label: 'Hire first',
      selector: '.deal-path:not(.deal-path--client)',
    },
    { label: 'Client first', selector: '.deal-path--client' },
  ]) {
    test(`${path.label} recurring phase has a readable measure at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto('./');
      await page.getByRole('button', { name: path.label, exact: true }).click();
      await waitForTourSettled(page);
      const phase = page.locator(
        `.proposal-sheet ${path.selector} .deal-recurring`,
      );
      const measure = await phase.evaluate((element) => {
        const rate = element.querySelector('strong')!.getBoundingClientRect();
        const explanation = element.querySelector('span')!;
        const range = document.createRange();
        range.selectNodeContents(explanation);
        const lines = [...range.getClientRects()];
        return {
          rateBottom: rate.bottom,
          explanationTop: lines[0].top,
          lineCount: lines.length,
        };
      });
      expect(measure.explanationTop).toBeGreaterThanOrEqual(measure.rateBottom);
      expect(measure.lineCount).toBeLessThanOrEqual(2);
    });
  }
}

for (const mode of [
  'normal reading',
  'reduced motion',
  'no JavaScript',
] as const) {
  test(`both paths use the same commission phases in ${mode}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(mode === 'normal reading' ? './?view=read' : './');
    for (const path of [
      { selector: '.deal-path:not(.deal-path--client)', rate: '15%' },
      { selector: '.deal-path--client', rate: '20%' },
    ]) {
      const article = page.locator(`.proposal-sheet ${path.selector}`);
      await expect(article.locator('.deal-rate')).toHaveText(path.rate);
      await expect(article.locator('.deal-rate-label')).toHaveText(
        'build + first 12 subscription months',
      );
      await expect(article.locator('.deal-recurring strong')).toHaveText(
        'then 5%',
      );
      await expect(article.locator('.deal-recurring span')).toHaveText(
        'recurring from service month 13',
      );
      await expect(article).not.toContainText('+ 5%');
    }
    await expect(page.locator('.collection-assumption')).toContainText(
      /build.only/i,
    );
    await expect(page.locator('.cover-statement')).toContainText(
      'No base salary',
    );
    await context.close();
  });
}

test('proposal notes explain the initial subscription basis and collection timing', async ({
  page,
}) => {
  await page.goto('./agreement/');
  for (const path of [
    { id: 'hire-first', rate: '15%' },
    { id: 'client-first', rate: '20%' },
  ]) {
    const section = page.locator(`#${path.id}`);
    await expect(section).toContainText(path.rate);
    await expect(section).toContainText(/first 12 service months/);
    await expect(section).toContainText(/service month 13/);
    await expect(section).toContainText(/5%/);
    await expect(section).toContainText(/collect/);
  }
  await expect(page.locator('#client-first')).toContainText(
    /future credited sales/,
  );
  await expect(page.locator('#cash-flow')).toContainText(
    /no upfront commission/i,
  );
});
