import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { collectionComparison, flyerCopy } from '../../src/content/proposal';

async function expectCompleteOutline(page: Page) {
  const main = page.getByRole('main');
  await expect(
    main.getByRole('article', {
      name: 'Growth partnership proposal',
      exact: true,
    }),
  ).toHaveCount(1);
  await expect(main.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    flyerCopy.cover.headlineLines.join(' '),
  );
  const headings = await Promise.all(
    (await main.getByRole('heading').all()).map((heading) =>
      heading.innerText(),
    ),
  );
  expect(headings.map((text) => text.replace(/\s+/g, ' ').trim())).toEqual([
    flyerCopy.cover.headlineLines.join(' '),
    flyerCopy.cash.headline,
    'Two ways to begin',
    'Hire first',
    'Client first',
    'days to begin.',
    flyerCopy.closing.headlineLines.join(' '),
  ]);
  const table = main.getByRole('table', {
    name: collectionComparison.tableLabel,
    exact: true,
  });
  await expect(table).toHaveCount(1);
  await expect(table).toHaveAccessibleDescription(
    `${collectionComparison.assumption} ${collectionComparison.rule} ${collectionComparison.qualifier}`,
  );
  await expect(
    table.getByRole('cell', { name: '$1,500', exact: true }),
  ).toHaveCount(1);
  await expect(
    table.getByRole('cell', { name: '$2,000', exact: true }),
  ).toHaveCount(1);
  expect(
    await page.locator('[id]').evaluateAll((elements) => {
      const ids = elements.map((element) => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
}

for (const width of [1440, 390]) {
  test(`the complete proposal outline is independent of the tour pose at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    for (const chapter of ['Overview', 'Cash flow', 'The window']) {
      await page.getByRole('button', { name: chapter, exact: true }).click();
      await expectCompleteOutline(page);
    }
    await testInfo.attach('tour-accessible-outline', {
      body: Buffer.from(await page.getByRole('main').ariaSnapshot()),
      contentType: 'text/plain',
    });
    const accessibility = await new AxeBuilder({ page })
      .withRules([
        'page-has-heading-one',
        'aria-hidden-focus',
        'duplicate-id-aria',
      ])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test('tabbing into the paper restores the original link and complete reading document', async ({
  page,
  browserName,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page
    .getByRole('button', { name: 'Grow together', exact: true })
    .focus();
  // macOS WebKit follows Safari's default: Option-Tab includes links.
  await page.keyboard.press(
    browserName === 'webkit' && process.platform === 'darwin'
      ? 'Alt+Tab'
      : 'Tab',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  const notes = page.locator('.proposal-link');
  await expect(notes).toBeFocused();
  await expect(notes).toBeInViewport({ ratio: 1 });
  await expect(page.locator('#tour-transcript')).toHaveCount(0);
  await expectCompleteOutline(page);

  await page
    .getByRole('button', { name: 'Take the tour', exact: true })
    .click();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expectCompleteOutline(page);
  await page
    .getByRole('button', { name: 'Read normally', exact: true })
    .click();
  await expect(page.locator('#tour-transcript')).toHaveCount(0);
  await expectCompleteOutline(page);
});

test('the visible paper link still opens the notes with a pointer', async ({
  page,
}) => {
  await page.goto('./');
  await page
    .getByRole('button', { name: 'Grow together', exact: true })
    .click();
  await page.locator('.proposal-link').click();
  await expect(page).toHaveURL(/\/agreement\/$/);
  await expect(
    page.getByRole('heading', { name: 'Proposal notes', exact: true }),
  ).toBeVisible();
});

test('the loading escape affects one visit while an explicit mode choice persists', async ({
  page,
}) => {
  await page.route('**/_astro/*.js', (route) => route.abort('failed'));
  await page.goto('./');
  await page
    .getByRole('link', { name: 'Read without animation', exact: true })
    .click();
  await expect(page).toHaveURL(/\?view=read$/);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  expect(
    await page.evaluate(() => localStorage.getItem('proposal-presentation')),
  ).toBeNull();
  await page.unroute('**/_astro/*.js');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );

  await page
    .getByRole('button', { name: 'Read normally', exact: true })
    .click();
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(
    page.getByRole('button', { name: 'Take the tour', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem('proposal-presentation')),
  ).toBe('read');
});
