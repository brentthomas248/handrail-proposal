import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
    'employment-first proposal uses collected 15/5 fees',
    async () => {
      await openStory('proposal-deal-path--employment-first');
      await expect(
        page.getByRole('heading', { name: 'Hire first' }),
      ).toBeVisible();
      await expect(page.getByText('15', { exact: true })).toBeVisible();
      await expect(page.getByText('+ 5%', { exact: true })).toBeVisible();
      await expect(page.getByText('of collected build fees')).toBeVisible();
      await expect(page.getByText('of collected recurring fees')).toBeVisible();
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
      await expect(page.getByText('+ 5%', { exact: true })).toBeVisible();
      await expect(
        page.getByText('I bring the paying client that makes hiring possible.'),
      ).toBeVisible();
      await expect(
        page.getByText('On that client and all my future credited sales.'),
      ).toBeVisible();
      await page.screenshot({ path: new URL('client.png', output).pathname });
    },
  );
  await check(
    'printed terms remain readable at 320px without horizontal overflow',
    async () => {
      await page.setViewportSize({ width: 320, height: 900 });
      await openStory('proposal-deal-path--narrow-layout');
      await expect(page.getByText('20', { exact: true })).toBeVisible();
      await expect(page.getByText('+ 5%', { exact: true })).toBeVisible();
      await expect(
        page.getByText('On that client and all my future credited sales.'),
      ).toBeVisible();
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
        path: new URL('client-mobile.png', output).pathname,
      });
    },
  );
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
