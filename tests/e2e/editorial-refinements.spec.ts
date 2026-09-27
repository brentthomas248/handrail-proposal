import { expect, test } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

test('small-phone cash comparison gives both rates their own aligned line', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
  await waitForTourSettled(page);
  const headings = await page
    .locator('.flyer-cash .collection-path-heading')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const label = [...element.childNodes].find(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        )!;
        const labelRange = document.createRange();
        labelRange.selectNodeContents(label);
        const rateRange = document.createRange();
        rateRange.selectNodeContents(
          element.querySelector('.collection-rate')!,
        );
        return {
          label: [...labelRange.getClientRects()].map((rect) => rect.toJSON()),
          rate: [...rateRange.getClientRects()].map((rect) => rect.toJSON()),
        };
      }),
    );
  expect(headings).toHaveLength(2);
  for (const heading of headings) {
    expect(heading.label).toHaveLength(1);
    expect(heading.rate).toHaveLength(1);
    expect(heading.rate[0].top).toBeGreaterThanOrEqual(heading.label[0].bottom);
    expect(
      Math.abs(heading.rate[0].left - heading.label[0].left),
    ).toBeLessThanOrEqual(1);
  }
  expect(
    Math.abs(headings[0].rate[0].bottom - headings[1].rate[0].bottom),
  ).toBeLessThanOrEqual(1);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 390, height: 664 },
  { width: 320, height: 740 },
]) {
  test(`cash rule and qualifier have distinct paragraph gaps at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
    await waitForTourSettled(page);
    const gaps = await page.locator('.flyer-cash').evaluate((section) => {
      const scale =
        section.getBoundingClientRect().width /
        (section as HTMLElement).offsetWidth;
      const paragraphs = [
        '.collection-difference',
        '.collection-rule',
        '.collection-qualifier',
      ].map((selector) => section.querySelector<HTMLElement>(selector)!);
      return paragraphs.slice(1).map((paragraph, index) => ({
        text: paragraph.textContent,
        gapInEm:
          (paragraph.getBoundingClientRect().top -
            paragraphs[index].getBoundingClientRect().bottom) /
          (Number.parseFloat(getComputedStyle(paragraph).fontSize) * scale),
      }));
    });
    for (const gap of gaps)
      expect(
        gap.gapInEm,
        `${gap.text}: leave at least .55em before the paragraph`,
      ).toBeGreaterThanOrEqual(0.55);
  });
}

for (const width of [1440, 768]) {
  for (const reading of [false, true]) {
    test(`window step explanations align at ${width}px in ${reading ? 'reading' : 'tour'}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width,
        height: width === 1440 ? 1000 : 1024,
      });
      await page.goto(reading ? './?view=read' : './');
      await page.evaluate(() => document.fonts.ready);
      if (!reading) {
        await page
          .getByRole('button', { name: 'The window', exact: true })
          .click();
        await waitForTourSettled(page);
      }
      const positions = await page
        .locator('.window-steps p')
        .evaluateAll((paragraphs) =>
          paragraphs.map((paragraph) => {
            const range = document.createRange();
            range.selectNodeContents(paragraph);
            const box = paragraph.getBoundingClientRect();
            return {
              top: range.getClientRects()[0].top,
              left: box.left,
              width: box.width,
            };
          }),
        );
      expect(positions).toHaveLength(3);
      const axis = positions.map((position) =>
        reading ? position.top : position.left,
      );
      expect(
        Math.max(...axis) - Math.min(...axis),
        reading
          ? 'Reading columns share a baseline'
          : 'Tour explanations share a left edge',
      ).toBeLessThanOrEqual(1);
      if (!reading) {
        expect(
          Math.min(...positions.map((position) => position.width)),
          'Tour rows allow a comfortable paragraph measure',
        ).toBeGreaterThanOrEqual(300);
        expect(positions[1].top).toBeGreaterThan(positions[0].top + 20);
        expect(positions[2].top).toBeGreaterThan(positions[1].top + 20);
      }
    });
  }
}

for (const [chapter, sectionSelector, textSelector] of [
  ['The two paths', '.flyer-rates', '.rate-scope, .rate-reason, .rate-shared'],
  ['The window', '.flyer-window', '.window-steps p'],
]) {
  const minimum = chapter === 'The window' ? 19 : 16.5;
  test(`tablet ${chapter} explanations retain at least ${minimum} effective pixels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('./');
    await page.getByRole('button', { name: chapter, exact: true }).click();
    await waitForTourSettled(page);
    const sizes = await page
      .locator(sectionSelector)
      .evaluate((section, selector) => {
        const scale =
          section.getBoundingClientRect().width /
          (section as HTMLElement).offsetWidth;
        return [...section.querySelectorAll(selector)].map(
          (element) =>
            Number.parseFloat(getComputedStyle(element).fontSize) * scale,
        );
      }, textSelector);
    expect(sizes).toHaveLength(3);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(minimum);
  });
}

for (const [chapter, nextGroup] of [
  ['The beginning', '.flyer-partnership'],
  ['The two paths', '.flyer-window'],
]) {
  test(`tablet ${chapter} does not leave partially visible sentences at the controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('./');
    await page.getByRole('button', { name: chapter, exact: true }).click();
    await waitForTourSettled(page);
    const cropped = await page.locator(nextGroup).evaluate((section) => {
      const edge = document
        .querySelector('.tour-controls')!
        .getBoundingClientRect().top;
      return [...section.querySelectorAll('h2, p, li > strong')].flatMap(
        (element) => {
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
          );
          const lines: DOMRect[] = [];
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            lines.push(
              ...[...range.getClientRects()].filter(
                (rect) => rect.width && rect.height,
              ),
            );
          }
          if (!lines.length) return [];
          const top = Math.min(...lines.map((line) => line.top));
          const bottom = Math.max(...lines.map((line) => line.bottom));
          return top < edge - 1 && bottom > edge + 1
            ? [{ text: element.textContent?.trim(), top, bottom, edge }]
            : [];
        },
      );
    });
    expect(
      cropped,
      'Peripheral paragraphs and headings must be complete or stay below the controls',
    ).toEqual([]);
  });
}

for (const width of [1440, 768]) {
  test(`resume contribution heading avoids a one-word final line at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 1024 });
    await page.goto('./resume/');
    await page.evaluate(() => document.fonts.ready);
    const lastLine = await page
      .locator('#contribution-title')
      .evaluate((heading) => {
        const node = heading.firstChild!;
        const text = node.textContent ?? '';
        const words = [...text.matchAll(/\S+/g)].map((match) => {
          const range = document.createRange();
          range.setStart(node, match.index!);
          range.setEnd(node, match.index! + match[0].length);
          return { word: match[0], top: range.getBoundingClientRect().top };
        });
        const lastTop = words.at(-1)!.top;
        return words
          .filter((word) => Math.abs(word.top - lastTop) <= 1)
          .map((word) => word.word);
      });
    expect(
      lastLine.length,
      `Final heading line: ${lastLine.join(' ')}`,
    ).toBeGreaterThanOrEqual(2);
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1366, height: 900 },
])
  test(`desktop rates omit a clipped next-heading fragment at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page
      .getByRole('button', { name: 'The two paths', exact: true })
      .click();
    await waitForTourSettled(page);
    const context = await page.locator('.window-title').evaluate((heading) => {
      const box = heading.getBoundingClientRect();
      const edge = document
        .querySelector('.tour-controls')!
        .getBoundingClientRect().top;
      return { top: box.top, bottom: box.bottom, edge };
    });
    expect(
      context.bottom <= context.edge || context.top >= context.edge,
      'The next title is complete or outside the scene, never a fragment',
    ).toBe(true);
  });
