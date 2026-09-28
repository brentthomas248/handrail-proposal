import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { dealPathCopy } from '../src/content/proposal.ts';

const base = new URL(process.env.STORYBOOK_BASE_URL || 'http://127.0.0.1:6006');
if (!['127.0.0.1', 'localhost'].includes(base.hostname)) {
  throw new Error(
    'Component verification is limited to the approved local Storybook service.',
  );
}
const output = new URL('../qa-artifacts/storybook/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];
const context = await browser.newContext({
  viewport: { width: 1000, height: 800 },
});
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
async function openStory(id) {
  await page.goto(new URL(`/iframe.html?id=${id}&viewMode=story`, base).href);
  await page.locator('#storybook-root .deal-path').waitFor();
  // The a11y addon's afterEach runs axe too. Wait for Storybook's completed
  // lifecycle before starting our scoped audit on the same document.
  await page.waitForFunction(
    () => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished',
  );
}
async function check(name, run) {
  await run();
  const audit = await new AxeBuilder({ page })
    .include('#storybook-root')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations, `${name}: accessibility violations`).toEqual([]);
  results.push({
    name,
    passed: true,
    accessibilityViolations: audit.violations.length,
  });
}
try {
  await check(
    'employment-first proposal uses 15% initially, then 5% recurring',
    async () => {
      await openStory('proposal-deal-path--employment-first');
      await expect(
        page.getByRole('heading', { name: 'Hire first' }),
      ).toBeVisible();
      await expect(page.getByText('15', { exact: true })).toBeVisible();
      await expect(page.getByText('then 5%', { exact: true })).toBeVisible();
      await expect(
        page.getByText('build + first 12 subscription months', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText('recurring from service month 13', { exact: true }),
      ).toBeVisible();
      await expect(page.getByText('+ 5%', { exact: true })).toHaveCount(0);
      await expect(
        page.getByText('Bring me on before I land the qualifying client.'),
      ).toBeVisible();
      await page.screenshot({
        path: new URL('employment.png', output).pathname,
      });
    },
  );
  await check(
    'client-first proposal rewards the enabling client and future sales',
    async () => {
      await openStory('proposal-deal-path--client-first');
      await expect(
        page.getByRole('heading', { name: 'Client first' }),
      ).toBeVisible();
      await expect(page.getByText('20', { exact: true })).toBeVisible();
      await expect(page.getByText('then 5%', { exact: true })).toBeVisible();
      await expect(
        page.getByText('build + first 12 subscription months', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText('recurring from service month 13', { exact: true }),
      ).toBeVisible();
      await expect(page.getByText('+ 5%', { exact: true })).toHaveCount(0);
      await expect(
        page.getByText(dealPathCopy.client.description),
      ).toBeVisible();
      await expect(
        page.getByText('On that client and all my future credited sales.'),
      ).toBeVisible();
      await page.screenshot({ path: new URL('client.png', output).pathname });
    },
  );
  for (const path of [
    {
      id: 'employment',
      story: 'narrow-employment',
      rate: '15',
      note: dealPathCopy.employment.note,
    },
    {
      id: 'client',
      story: 'narrow-layout',
      rate: '20',
      note: dealPathCopy.client.note,
    },
  ]) {
    await check(
      `${path.id} terms remain readable at 320px without horizontal overflow`,
      async () => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openStory(`proposal-deal-path--${path.story}`);
        await expect(page.getByText(path.rate, { exact: true })).toBeVisible();
        await expect(page.getByText('then 5%', { exact: true })).toBeVisible();
        await expect(
          page.getByText('build + first 12 subscription months', {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText('recurring from service month 13', { exact: true }),
        ).toBeVisible();
        await expect(page.getByText(path.note)).toBeVisible();
        expect(
          await page.evaluate(() => {
            const article = document.querySelector('.deal-path');
            if (!(article instanceof HTMLElement)) return false;
            return (
              article.scrollWidth <= article.clientWidth &&
              document.documentElement.scrollWidth <= innerWidth
            );
          }),
        ).toBe(true);
        await page.screenshot({
          path: new URL(`${path.id}-mobile.png`, output).pathname,
        });
      },
    );
  }
  expect(errors, 'Uncaught story errors').toEqual([]);
  await writeFile(
    new URL('verification.json', output),
    JSON.stringify({ passed: true, results, errors }, null, 2),
  );
  console.log(
    JSON.stringify({
      passed: true,
      checks: results.length,
      accessibilityViolations: 0,
      errors,
    }),
  );
} catch (error) {
  await writeFile(
    new URL('verification.json', output),
    JSON.stringify(
      { passed: false, results, errors, failure: String(error) },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
