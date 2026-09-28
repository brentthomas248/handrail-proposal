import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { waitForTourSettled } from '../helpers/tour-settled';

const closingName = 'Let’s do this!';
const closingSelector = '#lets-do-this';

async function chapter(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

async function expectClosingComposition(page: Page) {
  await expect(page.locator('#tour-caption')).toHaveText(closingName);
  await expect(page.locator('.chapter-nav button').last()).toHaveAttribute(
    'aria-current',
    'step',
  );
  const composition = await page
    .locator(closingSelector)
    .evaluate((element) => {
      const sheet = element.closest('.proposal-sheet')!;
      const panel = element.closest('.fold-panel')!;
      const face = element.closest('.panel-back')!;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(sheet).transform)
        .multiply(new DOMMatrixReadOnly(getComputedStyle(panel).transform))
        .multiply(new DOMMatrixReadOnly(getComputedStyle(face).transform));
      const normal = new DOMPoint(0, 0, 1, 0).matrixTransform(matrix);
      const header = document
        .querySelector('.site-header')!
        .getBoundingClientRect();
      const controls = document
        .querySelector('.tour-controls')!
        .getBoundingClientRect();
      const safe = {
        left: 24,
        right: innerWidth - 24,
        top: header.bottom + 24,
        bottom: controls.top - 24,
      };
      const heading = element.querySelector('h2')!.getBoundingClientRect();
      const watermark =
        element.querySelector<HTMLImageElement>('.closing-watermark')!;
      const image = watermark.getBoundingClientRect();
      const clipped = [heading, image].filter(
        (box) =>
          box.left < safe.left ||
          box.right > safe.right ||
          box.top < safe.top ||
          box.bottom > safe.bottom,
      );
      return {
        facing: normal.z / Math.hypot(normal.x, normal.y, normal.z),
        visibility: getComputedStyle(face).visibility,
        watermarkLoaded: watermark.complete && watermark.naturalWidth > 0,
        watermarkGap: image.top - heading.bottom,
        clipped: clipped.length,
        progress: Number(
          document
            .querySelector<HTMLElement>('.scroll-line')!
            .style.getPropertyValue('--tour-progress'),
        ),
        left: Number(
          document
            .querySelector<HTMLElement>('[data-panel="left"]')!
            .style.transform.match(/rotateY\(([^d]+)/)?.[1],
        ),
        right: Number(
          (panel as HTMLElement).style.transform.match(/rotateY\(([^d]+)/)?.[1],
        ),
      };
    });
  expect(composition.visibility).toBe('visible');
  expect(
    composition.facing,
    'The actual printed back must face the reader',
  ).toBeGreaterThan(0.995);
  expect(composition.watermarkLoaded).toBe(true);
  expect(
    composition.watermarkGap,
    'The watermark belongs below the invitation',
  ).toBeGreaterThan(12);
  expect(
    composition.clipped,
    'The complete invitation and watermark clear browser controls',
  ).toBe(0);
  expect(composition.left).toBeCloseTo(-174, 1);
  expect(composition.right).toBeCloseTo(-174, 1);
  expect(
    composition.progress,
    'The final chapter is the end of the continuous path',
  ).toBe(1);
}

async function recordClosing(page: Page) {
  return page.evaluateHandle(() => {
    const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
    const panels = [...document.querySelectorAll<HTMLElement>('.fold-panel')];
    const wing = (side: string) =>
      document.querySelector<HTMLElement>(`[data-panel="${side}"]`)!;
    const angle = (element: HTMLElement) =>
      Number(element.style.transform.match(/rotateY\(([^d]+)/)?.[1]);
    const frames: {
      elapsed: number;
      left: number;
      right: number;
      yaw: number;
      scale: number;
      scroll: number;
      progress: number;
      clipped: string[];
    }[] = [];
    let started: number | undefined;
    let running = true;
    const begin = () => {
      started ??= performance.now();
    };
    addEventListener('wheel', begin, { capture: true, once: true });
    function sample() {
      if (!running) return;
      if (started !== undefined) {
        const stage = document
          .querySelector('.flyer-stage')!
          .getBoundingClientRect();
        const header = document
          .querySelector('.site-header')!
          .getBoundingClientRect();
        const controls = document
          .querySelector('.tour-controls')!
          .getBoundingClientRect();
        const safe = {
          left: Math.max(0, stage.left) + 2,
          right: Math.min(innerWidth, stage.right) - 2,
          top: Math.max(header.bottom, stage.top) + 2,
          bottom: Math.min(controls.top, stage.bottom) - 2,
        };
        frames.push({
          elapsed: performance.now() - started,
          left: angle(wing('left')),
          right: angle(wing('right')),
          yaw: angle(sheet),
          scale: Number(sheet.style.transform.match(/scale3d\(([^,]+)/)?.[1]),
          scroll: scrollY,
          progress: Number(
            document
              .querySelector<HTMLElement>('.scroll-line')!
              .style.getPropertyValue('--tour-progress'),
          ),
          clipped: panels
            .filter((panel) => {
              const box = panel.getBoundingClientRect();
              return (
                box.left < safe.left ||
                box.right > safe.right ||
                box.top < safe.top ||
                box.bottom > safe.bottom
              );
            })
            .map((panel) => panel.dataset.panel!),
        });
      }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
    return {
      stop() {
        running = false;
        removeEventListener('wheel', begin, { capture: true });
        return frames;
      },
    };
  });
}

test('the last chapter prints the invitation on the actual right back face', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const finale = page.locator(closingSelector);
  await expect(
    finale,
    'A real semantic back-cover section is required',
  ).toHaveCount(1);
  await expect(finale).toHaveAttribute('data-print-face', 'back');
  await expect(finale).toHaveAttribute('data-print-panel', 'right');
  await expect(finale).toHaveAttribute('data-camera-order', '6');
  await expect(
    page.locator(
      '[data-panel="right"] .panel-back.closing-back > #lets-do-this',
    ),
  ).toHaveCount(1);
  await expect(finale.locator('h2')).toHaveAttribute('aria-label', closingName);
  await expect(finale.locator('h2 span')).toHaveText(['Let’s', 'do this!']);
  await expect(finale.locator('img.closing-watermark')).toHaveAttribute(
    'src',
    /handrail-logo\.png$/,
  );
  await expect(page.locator('.chapter-nav button').last()).toHaveAttribute(
    'aria-label',
    closingName,
  );
});

test('the partnership ink remains visible before and after folding closed', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await chapter(page, 'Grow together');
  for (const position of ['before', 'after']) {
    const box = await page.locator('.partnership-details').boundingBox();
    expect(box).not.toBeNull();
    const adjacent = await page
      .locator('[data-panel="center"] > .panel-face')
      .boundingBox();
    expect(adjacent).not.toBeNull();
    const adjacentPoint = {
      x: Math.min(page.viewportSize()!.width - 24, adjacent!.x + 48),
      y: box!.y + box!.height / 2,
    };
    expect(adjacentPoint.x).toBeGreaterThan(adjacent!.x);
    expect(adjacentPoint.x).toBeLessThan(adjacent!.x + adjacent!.width);
    expect(adjacentPoint.y).toBeGreaterThan(adjacent!.y);
    expect(adjacentPoint.y).toBeLessThan(adjacent!.y + adjacent!.height);
    const screenshot = await page.screenshot({ scale: 'css' });
    await testInfo.attach(`partnership-ink-${position}`, {
      body: screenshot,
      contentType: 'image/png',
    });
    const ink = await page.evaluate(
      async ({ png, box, adjacentPoint }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${png}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(
          Math.floor(box.x),
          Math.floor(box.y),
          Math.ceil(box.width),
          Math.ceil(box.height),
        ).data;
        let dark = 0;
        for (let index = 0; index < pixels.length; index += 4)
          if (
            Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) < 140
          )
            dark += 1;
        const adjacentPixels = context.getImageData(
          Math.round(adjacentPoint.x) - 10,
          Math.round(adjacentPoint.y) - 10,
          20,
          20,
        ).data;
        let rust = 0;
        for (let index = 0; index < adjacentPixels.length; index += 4)
          if (
            adjacentPixels[index] - adjacentPixels[index + 1] > 45 &&
            adjacentPixels[index] - adjacentPixels[index + 2] > 65
          )
            rust += 1;
        return {
          dark,
          pixels: pixels.length / 4,
          ratio: dark / (pixels.length / 4),
          adjacentPoint,
          rustRatio: rust / (adjacentPixels.length / 4),
        };
      },
      { png: screenshot.toString('base64'), box: box!, adjacentPoint },
    );
    await testInfo.attach(`partnership-ink-${position}-measurement`, {
      body: JSON.stringify(ink),
      contentType: 'application/json',
    });
    // Visible bounds also exist when another 3D plane covers the print. This
    // checks actual rendered text pixels, including both paragraph bodies.
    expect(
      ink.ratio,
      `The partnership paragraphs must remain visibly printed ${position} the close`,
    ).toBeGreaterThan(0.02);
    expect(
      ink.rustRatio,
      `The adjoining rust paper must not be covered by another paper plane ${position} the close`,
    ).toBeGreaterThan(0.5);
    if (position === 'before') {
      await page.mouse.move(720, 500);
      await page.mouse.wheel(0, 1);
      await waitForTourSettled(page);
      await page.mouse.wheel(0, -1);
      await waitForTourSettled(page);
      await expect(page.locator('#tour-caption')).toHaveText('Grow together');
    }
  }
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 390, height: 664 },
  { width: 320, height: 568 },
]) {
  test(`one gesture pulls back and folds onto the printed back at ${viewport.width}×${viewport.height}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(30_000);
    await page.setViewportSize(viewport);
    await page.goto('./');
    const origin = await chapter(page, 'Grow together');
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    const recording = await recordClosing(page);
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    const frames = await recording.evaluate((capture) => capture.stop());
    await recording.dispose();
    const motionPath = testInfo.outputPath('closing-fold-motion.json');
    await writeFile(motionPath, JSON.stringify(frames));
    await testInfo.attach('closing-fold-motion', {
      path: motionPath,
      contentType: 'application/json',
    });
    expect(frames.length).toBeGreaterThan(30);
    const firstMovement = frames.find((frame) => frame.scroll > origin + 1);
    expect(firstMovement).toBeDefined();
    expect(firstMovement!.elapsed).toBeLessThanOrEqual(200);
    const arrival = frames.find((frame) => frame.progress === 1);
    expect(arrival).toBeDefined();
    expect(
      arrival!.elapsed,
      'The multi-stage close should have time to read as a fold',
    ).toBeGreaterThanOrEqual(2400);
    expect(arrival!.elapsed).toBeLessThanOrEqual(3600);
    expect(Math.min(...frames.map((frame) => frame.scale))).toBeLessThan(
      frames[0].scale * 0.9,
    );
    expect(
      Math.max(...frames.map((frame) => frame.yaw)) -
        Math.min(...frames.map((frame) => frame.yaw)),
    ).toBeGreaterThan(25);
    for (const [minimum, maximum] of [
      [-10, 10],
      [-70, -40],
      [-130, -100],
    ]) {
      const stage = frames.filter(
        (frame) =>
          frame.left >= minimum &&
          frame.left <= maximum &&
          frame.right >= minimum &&
          frame.right <= maximum,
      );
      expect(
        stage.length,
        `The closing must actually traverse the ${minimum}° to ${maximum}° folding stage`,
      ).toBeGreaterThan(2);
      for (const frame of stage)
        expect(
          frame.clipped,
          'After pulling back, all three moving panels fit the stage',
        ).toEqual([]);
    }
    await expectClosingComposition(page);
    const finalY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 1);
    await page.keyboard.press('End');
    await waitForTourSettled(page);
    expect(await page.evaluate(() => scrollY)).toBe(finalY);
    await expectClosingComposition(page);
    await page.mouse.wheel(0, -1);
    await waitForTourSettled(page);
    await expect(page.locator('#tour-caption')).toHaveText('Grow together');
    expect(await page.evaluate(() => scrollY)).toBe(origin);
  });
}

test('reversing while the back closes returns to the complete partnership scene', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const origin = await chapter(page, 'Grow together');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await expect
    .poll(
      () =>
        page
          .locator('[data-panel="right"]')
          .evaluate((panel) =>
            Number(
              (panel as HTMLElement).style.transform.match(
                /rotateY\(([^d]+)/,
              )?.[1],
            ),
          ),
      { intervals: [20] },
    )
    .toBeLessThan(-45);
  await page.mouse.wheel(0, -1);
  await waitForTourSettled(page);
  await expect(page.locator('#tour-caption')).toHaveText('Grow together');
  expect(await page.evaluate(() => scrollY)).toBe(origin);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(origin);
});

test('short native touch gestures close the paper and reopen the partnership scene', async ({
  browser,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP dispatches native touch input');
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto('./');
    const origin = await chapter(page, 'Grow together');
    const session = await context.newCDPSession(page);
    expect(
      await page.evaluate(() =>
        Boolean(
          document
            .elementFromPoint(195, 580)
            ?.closest('a, button, input, textarea, select'),
        ),
      ),
    ).toBe(false);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 195, y: 580 }],
    });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 195, y: 560 }],
    });
    // Arrival must complete while the finger remains down, without requiring
    // a long drag, release velocity or additional scroll distance.
    await waitForTourSettled(page);
    await expectClosingComposition(page);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 195, y: 350 }],
    });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 195, y: 370 }],
    });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await waitForTourSettled(page);
    await expect(page.locator('#tour-caption')).toHaveText('Grow together');
    expect(await page.evaluate(() => scrollY)).toBe(origin);
    await session.detach();
  } finally {
    await context.close();
  }
});

test('the back-cover chapter survives mobile height refitting and a normal-reading round trip', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await chapter(page, closingName);
  const originalNode = await page.locator(closingSelector).elementHandle();
  await page.setViewportSize({ width: 390, height: 664 });
  await waitForTourSettled(page);
  await expectClosingComposition(page);
  await page
    .getByRole('button', { name: 'Read normally', exact: true })
    .click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('.proposal-content > #lets-do-this')).toHaveCount(
    1,
  );
  await expect(
    page.getByRole('heading', { name: /Let’s\s+do this!/ }),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Take the tour', exact: true })
    .click();
  await waitForTourSettled(page);
  await expectClosingComposition(page);
  expect(await originalNode!.evaluate((node) => node.isConnected)).toBe(true);
  expect(
    await originalNode!.evaluate(
      (node) => node === document.querySelector('#lets-do-this'),
    ),
  ).toBe(true);
  await originalNode!.dispose();
});

test('a final-section fragment and browser Back restore the folded invitation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#lets-do-this');
  await waitForTourSettled(page);
  await expectClosingComposition(page);
  await page.goto('./agreement/');
  await page.goBack();
  await waitForTourSettled(page);
  await expectClosingComposition(page);
});

for (const mode of [
  'normal reading',
  'reduced motion',
  'no JavaScript',
] as const) {
  test(`the final invitation remains last in ${mode}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
    });
    try {
      const page = await context.newPage();
      await page.goto(mode === 'normal reading' ? './?view=read' : './');
      await expect(page.locator('html')).toHaveAttribute(
        'data-presentation',
        'read',
      );
      await expect(
        page.locator('.proposal-content > [data-camera-stop]').last(),
      ).toHaveAttribute('id', 'lets-do-this');
      const heading = page.getByRole('heading', { name: /Let’s\s+do this!/ });
      await expect(heading).toHaveCount(1);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeInViewport({ ratio: 1 });
      const finale = page.locator(closingSelector);
      await expect(finale.locator('.closing-watermark')).toBeVisible();
      expect(
        await finale.evaluate((element) =>
          element.closest('[aria-hidden="true"], [inert]'),
        ),
      ).toBeNull();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    } finally {
      await context.close();
    }
  });
}

test('folding closed caches the newly exposed printed back', async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(
    browserName !== 'chromium',
    'CDP exposes actual face paint counters',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await chapter(page, 'Grow together');
  const session = await page.context().newCDPSession(page);
  const { root } = await session.send('DOM.getDocument');
  const { nodeId } = await session.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '[data-panel="right"] .panel-back',
  });
  const { node } = await session.send('DOM.describeNode', { nodeId });
  const paints: number[] = [];
  const counters = new Map<string, number>();
  let recording = false;
  session.on(
    'LayerTree.layerTreeDidChange',
    ({
      layers = [],
    }: {
      layers?: {
        layerId: string;
        backendNodeId?: number;
        paintCount: number;
      }[];
    }) => {
      for (const layer of layers) {
        if (layer.backendNodeId !== node.backendNodeId) continue;
        const previous = counters.get(layer.layerId) ?? 0;
        const delta =
          layer.paintCount >= previous
            ? layer.paintCount - previous
            : layer.paintCount;
        if (recording && delta > 0) paints.push(delta);
        counters.set(layer.layerId, layer.paintCount);
      }
    },
  );
  await session.send('LayerTree.enable');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  recording = true;
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await waitForTourSettled(page);
  recording = false;
  await expectClosingComposition(page);
  const paintPath = testInfo.outputPath('closing-back-paint-count.json');
  await writeFile(
    paintPath,
    JSON.stringify({
      paints,
      total: paints.reduce((sum, value) => sum + value, 0),
    }),
  );
  await testInfo.attach('closing-back-paint-count', {
    path: paintPath,
    contentType: 'application/json',
  });
  expect(
    paints.length,
    'A newly exposed back must prove the counter captured actual painting',
  ).toBeGreaterThan(0);
  expect(
    paints.reduce((sum, value) => sum + value, 0),
    'The printed invitation may paint on exposure, but must not repaint on each folding frame',
  ).toBeLessThanOrEqual(2);
  await session.detach();
});
