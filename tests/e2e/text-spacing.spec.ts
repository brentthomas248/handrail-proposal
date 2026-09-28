import { expect, test, type Page } from '@playwright/test';

const spacing = `
  * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
  p { margin-bottom: 2em !important; }
`;

async function expectReading(page: Page) {
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(page.locator('#reading-mode')).toBeDisabled();
  const metrics = await page
    .locator('.cover-description')
    .evaluate((element) => {
      const style = getComputedStyle(element);
      const font = Number.parseFloat(style.fontSize);
      return {
        line: Number.parseFloat(style.lineHeight) / font,
        letter: Number.parseFloat(style.letterSpacing) / font,
        word: Number.parseFloat(style.wordSpacing) / font,
        paragraph: Number.parseFloat(style.marginBottom) / font,
      };
    });
  expect(metrics.line).toBeCloseTo(1.5, 2);
  expect(metrics.letter).toBeCloseTo(0.12, 2);
  expect(metrics.word).toBeCloseTo(0.16, 2);
  expect(metrics.paragraph).toBeCloseTo(2, 2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

for (const width of [320, 390, 768, 1440]) {
  for (const beforeStartup of [true, false]) {
    test(`text spacing selects complete reading at ${width}px ${beforeStartup ? 'before' : 'after'} startup`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      if (beforeStartup)
        await page.addInitScript((css) => {
          const insert = () => {
            if (!document.head) return false;
            const style = document.createElement('style');
            style.id = 'reader-spacing';
            style.textContent = css;
            document.head.append(style);
            return true;
          };
          if (!insert()) {
            const observer = new MutationObserver(() => {
              if (insert()) observer.disconnect();
            });
            observer.observe(document, { childList: true, subtree: true });
          }
        }, spacing);
      await page.goto('./');
      if (!beforeStartup) {
        await expect(page.locator('html')).toHaveClass(/camera-ready/);
        const chapter = page.getByRole('button', {
          name: width < 760 ? 'Client first' : 'The two paths',
          exact: true,
        });
        await chapter.press('Enter');
        await expect(chapter).toHaveAttribute('aria-current', 'step');
        await page.addStyleTag({ content: spacing });
      }
      await expectReading(page);
      if (!beforeStartup) {
        const target = page.locator(
          width < 760 ? '[data-camera-mobile="Client first"]' : '#paths',
        );
        const frame = await target.evaluate((element) => ({
          top: element.getBoundingClientRect().top,
          header: document
            .querySelector('.site-header')!
            .getBoundingClientRect().bottom,
          focusInside: element.contains(document.activeElement),
        }));
        expect(frame.top).toBeGreaterThanOrEqual(frame.header);
        expect(frame.focusInside).toBe(true);
      }
      for (const id of [
        'idea',
        'cash-flow',
        'paths',
        'window',
        'together',
        'lets-do-this',
      ]) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        const bounds = await section.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      }
      await page.setViewportSize({ width, height: 740 });
      await expectReading(page);
      await testInfo.attach('spacing-reading', {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
    });
  }
}

for (const override of [
  '.cover-description { line-height: 1.72 !important; }',
  '.rate-reason { letter-spacing: .07em !important; }',
  '.window-steps p { margin-bottom: 1.3em !important; }',
  '.partnership-details p { word-spacing: .23em !important; }',
  '.cover-description { font-size: 58px !important; }',
])
  test(`changed authored metrics recover after removing ${override}`, async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Cash flow', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    const style = await page.addStyleTag({ content: override });
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    await expect(page.locator('#reading-mode')).toBeDisabled();
    await style.evaluate((element) => element.parentNode?.removeChild(element));
    await expect(page.locator('#reading-mode')).toBeEnabled();
    await page.locator('#reading-mode').click();
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await expect(
      page.getByRole('button', { name: 'Cash flow', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
  });

for (const chooseNewSection of [false, true])
  test(`closing notes Back restores semantic reading intent${chooseNewSection ? ' until a new gesture' : ''}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const closing = page.getByRole('button', {
      name: 'Grow together',
      exact: true,
    });
    await closing.press('Enter');
    await expect(closing).toHaveAttribute('aria-current', 'step');
    const notes = page.locator('.proposal-sheet a[href$="/agreement/"]');
    // Focus/history behavior is independent of the OS setting for Tab-to-links.
    await notes.focus();
    await expect(notes).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('h1')).toHaveText('Proposal notes');
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    if (chooseNewSection) {
      const distance = await page
        .locator('#cash-flow')
        .evaluate(
          (element) =>
            element.getBoundingClientRect().top -
            document.querySelector('.site-header')!.getBoundingClientRect()
              .bottom -
            24,
        );
      await page.mouse.wheel(0, distance);
      await expect
        .poll(async () =>
          page
            .locator('#cash-flow')
            .evaluate((element) =>
              Math.abs(
                element.getBoundingClientRect().top -
                  document
                    .querySelector('.site-header')!
                    .getBoundingClientRect().bottom -
                  24,
              ),
            ),
        )
        .toBeLessThanOrEqual(3);
    }
    await page
      .getByRole('button', { name: 'Take the tour', exact: true })
      .click();
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await expect(
      page.getByRole('button', {
        name: chooseNewSection ? 'Cash flow' : 'Grow together',
        exact: true,
      }),
    ).toHaveAttribute('aria-current', 'step');
  });

test('paper height includes trailing section margin and lower face padding', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const chapter = page.getByRole('button', {
    name: 'Client first',
    exact: true,
  });
  await chapter.click();
  await expect(chapter).toHaveAttribute('aria-current', 'step');
  const extents = await page
    .locator('.fold-panel[data-panel="right"] .panel-face')
    .evaluateAll((faces) =>
      faces.map((face) => {
        const style = getComputedStyle(face);
        const visible = [...face.children].filter(
          (child) => getComputedStyle(child).display !== 'none',
        );
        const last = visible.at(-1) as HTMLElement;
        return {
          height: (face as HTMLElement).offsetHeight,
          needed:
            last.offsetTop +
            last.offsetHeight +
            Number.parseFloat(getComputedStyle(last).marginBottom) +
            Number.parseFloat(style.paddingBottom),
        };
      }),
    );
  for (const extent of extents)
    expect(extent.height).toBeGreaterThanOrEqual(extent.needed - 1);
});
