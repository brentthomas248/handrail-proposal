import { waitForTourSettled } from '../helpers/tour-settled';
import { expect, test } from '@playwright/test';
import { flyerCopy } from '../../src/content/proposal';

for (const width of [320, 390, 1440]) {
  test(`ordinary reading preserves the hire-first future-sales scope at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./?view=read');
    const hireFirst = page.locator('.rate-group').first();
    await expect(hireFirst).toContainText('Hire first');
    await expect(hireFirst.locator('.rate-scope')).toHaveText(
      flyerCopy.paths.scope,
    );
    await expect(hireFirst.locator('.rate-scope')).toBeVisible();
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
  { width: 390, height: 664 },
]) {
  test(`the window has a real lower paper margin at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page.getByRole('button', { name: 'The window', exact: true }).click();
    await waitForTourSettled(page);
    const space = await page.locator('.flyer-window').evaluate((section) => {
      const face = section.closest('.panel-face')!;
      const footer = face.querySelector<HTMLElement>('.panel-colophon')!;
      const inkBottom = Math.max(
        ...[...section.querySelectorAll('.window-steps p')].flatMap(
          (paragraph) => {
            const range = document.createRange();
            range.selectNodeContents(paragraph);
            return [...range.getClientRects()].map((rect) => rect.bottom);
          },
        ),
      );
      const edge =
        getComputedStyle(footer).display === 'none'
          ? face.getBoundingClientRect().bottom
          : footer.getBoundingClientRect().top;
      return edge - inkBottom;
    });
    expect(
      space,
      'The last complete sentence needs at least 20px before the physical edge or footer rule',
    ).toBeGreaterThanOrEqual(20);
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
]) {
  test(`financial and window explanations keep readable supporting type at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    for (const [chapter, selector, text] of [
      [
        'Cash flow',
        '.flyer-cash',
        '.collection-assumption, .collection-row-label, .collection-difference, .collection-rule, .collection-qualifier',
      ],
      ['The window', '.flyer-window', '.window-steps p'],
    ]) {
      await page.getByRole('button', { name: chapter, exact: true }).click();
      await waitForTourSettled(page);
      const sizes = await page
        .locator(selector)
        .evaluate((section, children) => {
          const scale =
            section.getBoundingClientRect().width /
            (section as HTMLElement).offsetWidth;
          return [...section.querySelectorAll(children)].map(
            (element) =>
              Number.parseFloat(getComputedStyle(element).fontSize) * scale,
          );
        }, text);
      expect(
        Math.min(...sizes),
        `${chapter}: essential supporting type should remain at least 16 effective pixels`,
      ).toBeGreaterThanOrEqual(16);
    }
  });
}

test('the short-phone cover preserves a visible top paper margin and complete copy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto('./');
  await page
    .getByRole('button', { name: 'The beginning', exact: true })
    .click();
  await waitForTourSettled(page);
  const framing = await page.locator('.flyer-cover').evaluate((cover) => {
    const face = cover.closest('.panel-face')!;
    const header = document
      .querySelector('.site-header')!
      .getBoundingClientRect();
    const controls = document
      .querySelector('.tour-controls')!
      .getBoundingClientRect();
    const walker = document.createTreeWalker(cover, NodeFilter.SHOW_TEXT);
    const lines: DOMRect[] = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      lines.push(...range.getClientRects());
    }
    return {
      paperClearance: face.getBoundingClientRect().top - header.bottom,
      inkClearance: Math.min(...lines.map((line) => line.top)) - header.bottom,
      lowerClearance:
        controls.top - Math.max(...lines.map((line) => line.bottom)),
      left: Math.min(...lines.map((line) => line.left)),
      right: Math.max(...lines.map((line) => line.right)),
    };
  });
  expect(
    framing.paperClearance,
    'A strip of ground must separate the header and paper top',
  ).toBeGreaterThanOrEqual(4);
  expect(framing.inkClearance).toBeGreaterThanOrEqual(8);
  expect(framing.lowerClearance).toBeGreaterThanOrEqual(8);
  expect(framing.left).toBeGreaterThanOrEqual(0);
  expect(framing.right).toBeLessThanOrEqual(390);
});

for (const width of [320, 390]) {
  test(`phone navigation names chapters and opens proposal notes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const names = await page
      .locator('.chapter-nav button span')
      .evaluateAll((labels) =>
        labels.map((label) => ({
          text: label.textContent,
          size: Number.parseFloat(getComputedStyle(label).fontSize),
        })),
      );
    expect(names.map((name) => name.text)).toEqual([
      'Overview',
      'The beginning',
      'Cash flow',
      'Hire first',
      'Client first',
      'The window',
      'Grow together',
    ]);
    expect(names.every((name) => name.size >= 11)).toBe(true);
    await page
      .getByRole('button', { name: 'Client first', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Client first', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    await page
      .locator('.site-header')
      .getByRole('link', { name: 'Proposal notes', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Proposal notes', exact: true }),
    ).toBeVisible();
  });
}

for (const width of [768, 820, 960, 1024, 1440]) {
  test(`notes keep financial columns visually separate at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('./agreement/');
    await page.locator('#collections').scrollIntoViewIfNeeded();
    const gaps = await page
      .locator('.collection-table tbody tr')
      .evaluateAll((rows) =>
        rows.map((row) => {
          const amounts = [...row.querySelectorAll('td')].map((cell) => {
            const range = document.createRange();
            range.selectNodeContents(cell);
            return range.getBoundingClientRect();
          });
          return amounts[1].left - amounts[0].right;
        }),
      );
    expect(
      Math.min(...gaps),
      'The two paths need distinct amounts with a visible gutter',
    ).toBeGreaterThanOrEqual(12);
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
]) {
  test(`the closing argument uses readable body type at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page
      .getByRole('button', { name: 'Grow together', exact: true })
      .click();
    await waitForTourSettled(page);
    const sizes = await page
      .locator('.flyer-partnership')
      .evaluate((section) => {
        const scale =
          section.getBoundingClientRect().width /
          (section as HTMLElement).offsetWidth;
        return [
          ...section.querySelectorAll(
            '.partnership-details p, .proposal-note, .proposal-link',
          ),
        ].map(
          (element) =>
            Number.parseFloat(getComputedStyle(element).fontSize) * scale,
        );
      });
    expect(
      Math.min(...sizes),
      'The closing argument and next step should use at least 16 effective pixels',
    ).toBeGreaterThanOrEqual(16);
  });
}

for (const route of ['./?view=read', './agreement/']) {
  test(`small-phone financial columns retain a visible gutter with reader text spacing on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(route);
    await page.addStyleTag({
      content:
        '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
    });
    const table = page.locator('.collection-table');
    await table.scrollIntoViewIfNeeded();
    const gaps = await table.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => {
        const ink = [...row.querySelectorAll('td')].map((cell) => {
          const range = document.createRange();
          range.selectNodeContents(cell);
          return range.getBoundingClientRect();
        });
        return ink[1].left - ink[0].right;
      }),
    );
    expect(
      Math.min(...gaps),
      'Reader spacing must not visually merge the two monetary columns',
    ).toBeGreaterThanOrEqual(12);
    const overflow = await page
      .locator('.collection-comparison')
      .evaluate((comparison) => {
        const edge = comparison.getBoundingClientRect().right;
        return Math.max(
          ...[
            ...comparison.querySelectorAll(
              '.collection-value, .collection-collected-amount',
            ),
          ].map((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return range.getBoundingClientRect().right - edge;
          }),
        );
      });
    expect(
      overflow,
      'Every amount must fit the comparison content width',
    ).toBeLessThanOrEqual(1);
  });
}

for (const width of [320, 1440]) {
  for (const route of ['./', './?view=read']) {
    test(`skip-link landing clears the header at ${width}px on ${route}`, async ({
      page,
      browserName,
    }) => {
      // macOS WebKit follows Safari's default: Option-Tab includes links.
      const linkTab =
        browserName === 'webkit' && process.platform === 'darwin'
          ? 'Alt+Tab'
          : 'Tab';
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      await expect(page.locator('#reading-mode')).toBeVisible();
      await page.keyboard.press(linkTab);
      await expect(
        page.getByRole('link', { name: 'Skip to content' }),
      ).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('html')).toHaveAttribute(
        'data-presentation',
        'read',
      );
      const clearance = await page
        .locator('.cover-intro')
        .evaluate(
          (element) =>
            element.getBoundingClientRect().top -
            document.querySelector('.site-header')!.getBoundingClientRect()
              .bottom,
        );
      expect(
        clearance,
        'Skipping navigation must land the opening copy below the fixed header',
      ).toBeGreaterThanOrEqual(8);
      await page.keyboard.press(linkTab);
      await expect(
        page.getByRole('link', {
          name: 'Read the proposal notes',
          exact: true,
        }),
      ).toBeFocused();
    });
  }
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
]) {
  test(`the phone cover does not reveal a cropped closing headline at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page
      .getByRole('button', { name: 'The beginning', exact: true })
      .click();
    await waitForTourSettled(page);
    const separation = await page
      .locator('.partnership-lead h2')
      .evaluate(
        (heading) =>
          heading.getBoundingClientRect().top -
          document.querySelector('.tour-controls')!.getBoundingClientRect().top,
      );
    expect(
      separation,
      'The later closing headline stays outside the cover composition',
    ).toBeGreaterThanOrEqual(0);
  });
}
