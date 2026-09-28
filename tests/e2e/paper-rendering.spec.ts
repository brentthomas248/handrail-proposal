import { expect, test, type Browser } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { waitForTourSettled } from '../helpers/tour-settled';

interface PaperNode {
  backendNodeId: number;
  attributes?: string[];
  children?: PaperNode[];
}

interface PaperLayer {
  layerId: string;
  backendNodeId?: number;
  drawsContent: boolean;
  paintCount: number;
  width: number;
  height: number;
}

async function coldOpening(browser: Browser, mobile: boolean) {
  const context = await browser.newContext({
    viewport: { width: mobile ? 390 : 1440, height: 844 },
    deviceScaleFactor: mobile ? 3 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  try {
    const page = await context.newPage();
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const session = await context.newCDPSession(page);
    const { root }: { root: PaperNode } = await session.send(
      'DOM.getDocument',
      { depth: -1 },
    );
    const faceIds = new Map<number, string>();
    function identify(node: PaperNode, panel = '') {
      const attributes = node.attributes ?? [];
      const value = (name: string) => {
        const index = attributes.indexOf(name);
        return index < 0 ? '' : attributes[index + 1];
      };
      const owner = value('data-panel') || panel;
      const classes = value('class').split(/\s+/);
      if (classes.includes('panel-face') || classes.includes('panel-back'))
        faceIds.set(
          node.backendNodeId,
          `${owner}:${classes.includes('panel-face') ? 'front' : 'back'}`,
        );
      node.children?.forEach((child) => identify(child, owner));
    }
    identify(root);
    expect(faceIds.size).toBe(6);
    // Keep ownership across layer replacements: recreating a face backing must
    // not reset its paint allowance and disguise continual raster work.
    const layerOwners = new Map<string, number>();
    const previousPaints = new Map<string, number>();
    const facePaints: {
      layerId: string;
      backendNodeId: number;
      face: string;
      elapsed: number;
      paints: number;
      width: number;
      height: number;
    }[] = [];
    let started: number | undefined;
    session.on(
      'LayerTree.layerTreeDidChange',
      ({ layers = [] }: { layers?: PaperLayer[] }) => {
        for (const layer of layers)
          if (
            layer.backendNodeId !== undefined &&
            faceIds.has(layer.backendNodeId)
          ) {
            layerOwners.set(layer.layerId, layer.backendNodeId);
            const previous = previousPaints.get(layer.layerId) ?? 0;
            const paints =
              layer.paintCount >= previous
                ? layer.paintCount - previous
                : layer.paintCount;
            if (started !== undefined && paints > 0)
              facePaints.push({
                layerId: layer.layerId,
                backendNodeId: layer.backendNodeId,
                face: faceIds.get(layer.backendNodeId)!,
                elapsed: performance.now() - started,
                paints,
                width: layer.width,
                height: layer.height,
              });
            previousPaints.set(layer.layerId, layer.paintCount);
          }
      },
    );
    await session.send('LayerTree.enable');
    await session.send('Performance.enable');
    // Let the initial folded packet present; never visit or warm the reveal.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const recording = await page.evaluateHandle(() => {
      const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
      const left = document.querySelector<HTMLElement>('[data-panel="left"]')!;
      const right = document.querySelector<HTMLElement>(
        '[data-panel="right"]',
      )!;
      const frames: {
        elapsed: number;
        camera: string;
        angle: number;
        rightAngle: number;
        scroll: number;
      }[] = [];
      let start: number | undefined;
      let running = true;
      const begin = () => {
        start ??= performance.now();
      };
      addEventListener('wheel', begin, { capture: true, once: true });
      addEventListener('touchmove', begin, { capture: true, once: true });
      const angle = (element: HTMLElement) =>
        Number(element.style.transform.match(/rotateY\(([^d]+)/)?.[1]);
      function sample() {
        if (!running) return;
        if (start !== undefined)
          frames.push({
            elapsed: performance.now() - start,
            camera: sheet.style.transform,
            angle: angle(left),
            rightAngle: angle(right),
            scroll: scrollY,
          });
        requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
      return {
        stop() {
          running = false;
          removeEventListener('wheel', begin, { capture: true });
          removeEventListener('touchmove', begin, { capture: true });
          return frames;
        },
      };
    });
    const before = await session.send('Performance.getMetrics');
    started = performance.now();
    if (mobile) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: 195, y: 500 }],
      });
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 195, y: 480 }],
      });
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
    } else {
      await page.mouse.move(720, 420);
      await page.mouse.wheel(0, 1);
    }
    await waitForTourSettled(page);
    const after = await session.send('Performance.getMetrics');
    started = undefined;
    const frames = await recording.evaluate((capture) => capture.stop());
    await recording.dispose();
    const final = frames.at(-1)!;
    const arrival = frames.find(
      (frame) => frame.camera === final.camera && frame.scroll === final.scroll,
    );
    expect(arrival).toBeDefined();
    expect(arrival!.elapsed).toBeGreaterThanOrEqual(1300);
    expect(arrival!.elapsed).toBeLessThanOrEqual(2300);
    expect(new Set(frames.map((frame) => frame.camera)).size).toBeGreaterThan(
      30,
    );
    expect(final.angle).toBeCloseTo(38, 1);
    expect(final.rightAngle).toBeCloseTo(38, 1);
    expect(final.scroll).toBeGreaterThan(0);
    await expect(page.locator('#tour-caption')).toHaveText('The full proposal');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => scrollY)).toBe(final.scroll);
    const metric = (
      result: { metrics: { name: string; value: number }[] },
      name: string,
    ) => result.metrics.find((entry) => entry.name === name)!.value;
    expect(new Set(layerOwners.values()).size).toBeGreaterThanOrEqual(3);
    // Some Chromium builds omit layerPainted events. The layer-tree paint
    // counter still exposes actual paint work; newly exposed fronts prove this
    // capture is live instead of accepting an empty event stream as a pass.
    expect(facePaints.length).toBeGreaterThan(0);
    await session.detach();
    return {
      input: mobile ? 'native touch' : 'wheel',
      frames,
      facePaints,
      paintCounts: Object.fromEntries(
        [...faceIds].map(([id, face]) => [
          face,
          facePaints
            .filter((paint) => paint.backendNodeId === id)
            .reduce((count, paint) => count + paint.paints, 0),
        ]),
      ),
      layouts: metric(after, 'LayoutCount') - metric(before, 'LayoutCount'),
    };
  } finally {
    await context.close();
  }
}

for (const mobile of [true, false]) {
  const input = mobile ? 'native phone touch' : 'desktop wheel';
  test(`cold ${input} opening retains its paper paint while the folds move`, async ({
    browser,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName !== 'chromium',
      'CDP exposes actual layer paint counters',
    );
    const result = await coldOpening(browser, mobile);
    const path = testInfo.outputPath('cold-paper-paint.json');
    await writeFile(path, JSON.stringify(result));
    await testInfo.attach('cold-paper-paint', {
      path,
      contentType: 'application/json',
    });
    for (const [face, count] of Object.entries(result.paintCounts))
      expect(
        count,
        `${face} may paint when first exposed, then must retain its printed surface throughout the unfold`,
      ).toBeLessThanOrEqual(2);
  });

  test(`cold ${input} opening does not lay out the document on each camera frame`, async ({
    browser,
    browserName,
  }, testInfo) => {
    test.skip(browserName !== 'chromium', 'CDP exposes document layout counts');
    const result = await coldOpening(browser, mobile);
    const path = testInfo.outputPath('cold-opening-layout.json');
    await writeFile(path, JSON.stringify(result));
    await testInfo.attach('cold-opening-layout', {
      path,
      contentType: 'application/json',
    });
    // Allow bounded caption and newly exposed face setup, never one layout for
    // each of the more than thirty independently observed camera updates.
    expect(result.layouts).toBeLessThanOrEqual(6);
  });
}
