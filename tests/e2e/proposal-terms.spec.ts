import { expect, test } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
]) {
  test(`the recurring phase has a readable measure at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page
      .getByRole('button', { name: 'Client first', exact: true })
      .click();
    await waitForTourSettled(page);
    const phase = page.locator(
      '.proposal-sheet .deal-path--client .deal-recurring',
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

for (const mode of [
  'normal reading',
  'reduced motion',
  'no JavaScript',
] as const) {
  test(`the client-first subscription phases remain distinct in ${mode}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(mode === 'normal reading' ? './?view=read' : './');
    const client = page.locator('.proposal-sheet .deal-path--client');
    await expect(client.locator('.deal-rate')).toHaveText('20%');
    await expect(client.locator('.deal-rate-label')).toHaveText(
      'build + first 12 subscription months',
    );
    await expect(client.locator('.deal-recurring strong')).toHaveText(
      'then 5%',
    );
    await expect(client.locator('.deal-recurring span')).toHaveText(
      'recurring from service month 13',
    );
    await expect(client).not.toContainText('+ 5%');
    const hire = page.locator(
      '.proposal-sheet .deal-path:not(.deal-path--client)',
    );
    await expect(hire.locator('.deal-rate-label')).toHaveText(
      'of collected build fees',
    );
    await expect(hire.locator('.deal-recurring strong')).toHaveText('+ 5%');
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
  const client = page.locator('#client-first');
  await expect(client).toContainText(/20%/);
  await expect(client).toContainText(/first 12 service months/);
  await expect(client).toContainText(/service month 13/);
  await expect(client).toContainText(/5%/);
  await expect(client).toContainText(/collect/);
  await expect(client).toContainText(/future credited sales/);
  await expect(page.locator('#cash-flow')).toContainText(
    /no upfront commission/i,
  );
});
