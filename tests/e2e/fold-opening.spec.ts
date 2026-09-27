import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { waitForTourSettled } from '../helpers/tour-settled';

async function wings(page: Page) {
  return page
    .locator('[data-panel="left"], [data-panel="right"]')
    .evaluateAll((panels) =>
      panels.map((panel) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
        return {
          name: (panel as HTMLElement).dataset.panel!,
          angle: Math.abs(
            (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI,
          ),
        };
      }),
    );
}

async function scale(page: Page) {
  return page.locator('.proposal-sheet').evaluate((sheet) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(sheet).transform);
    return Math.hypot(matrix.m11, matrix.m12, matrix.m13);
  });
}

async function overviewPosition(
  page: Page,
  firstReadingY: number,
  opened: Awaited<ReturnType<typeof wings>>,
) {
  let before = 0;
  let after = Math.ceil(firstReadingY);
  // The first reading pose has the fully opened hinge angles. Find their first
  // occurrence through rendered geometry; later cover travel can change freely.
  await page.evaluate(() => window.dispatchEvent(new Event('touchstart')));
  try {
    while (after - before > 1) {
      const position = Math.floor((before + after) / 2);
      await page.evaluate((y) => window.scrollTo(0, y), position);
      await waitForTourSettled(page);
      const currentWings = await wings(page);
      if (
        currentWings.every(
          (wing) =>
            Math.abs(
              wing.angle -
                opened.find((target) => target.name === wing.name)!.angle,
            ) <= 0.01,
        )
      )
        after = position;
      else before = position;
    }
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event('touchend')));
  }
  return after;
}

async function recordFrames(page: Page) {
  return page.evaluateHandle(() => {
    const panels = [...document.querySelectorAll<HTMLElement>('.fold-panel')];
    const header = document.querySelector<HTMLElement>('.site-header')!;
    const controls = document.querySelector<HTMLElement>('.tour-controls')!;
    const stage = document.querySelector<HTMLElement>('.flyer-stage')!;
    const progress = document.querySelector<HTMLElement>('.scroll-line')!;
    const frames: {
      time: number;
      scroll: number;
      progress: number;
      clipped: string[];
      panels: {
        name: string;
        left: number;
        right: number;
        top: number;
        bottom: number;
      }[];
      safe: { left: number; right: number; top: number; bottom: number };
    }[] = [];
    let running = true;
    function sample(time: number) {
      if (!running) return;
      const visible = window.visualViewport;
      const stageBox = stage.getBoundingClientRect();
      const safe = {
        left: Math.max(stageBox.left, visible?.offsetLeft ?? 0) + 2,
        right:
          Math.min(
            stageBox.right,
            (visible?.offsetLeft ?? 0) + (visible?.width ?? innerWidth),
          ) - 2,
        top:
          Math.max(
            stageBox.top,
            header.getBoundingClientRect().bottom,
            visible?.offsetTop ?? 0,
          ) + 2,
        bottom:
          Math.min(
            stageBox.bottom,
            controls.getBoundingClientRect().top,
            (visible?.offsetTop ?? 0) + (visible?.height ?? innerHeight),
          ) - 2,
      };
      const boxes = panels.map((panel) => {
        const { left, right, top, bottom } = panel.getBoundingClientRect();
        return { name: panel.dataset.panel!, left, right, top, bottom };
      });
      frames.push({
        time,
        scroll: scrollY,
        progress: Number(progress.style.getPropertyValue('--tour-progress')),
        clipped: boxes
          .filter(
            (box) =>
              box.left < safe.left ||
              box.right > safe.right ||
              box.top < safe.top ||
              box.bottom > safe.bottom,
          )
          .map((box) => box.name),
        panels: boxes,
        safe,
      });
      requestAnimationFrame(sample);
    }
    sample(performance.now());
    return {
      stop() {
        running = false;
        return frames;
      },
    };
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 390, height: 664 },
  { width: 320, height: 740 },
]) {
  test(`the cold opening has a consistently paced pullback at ${viewport.width}×${viewport.height}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    // No navigation or preliminary traversal: this must inspect the first reveal.
    const recording = await page.evaluateHandle(() => {
      const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
      const wing = document.querySelector<HTMLElement>('[data-panel="left"]')!;
      const frames: { angle: number; scale: number }[] = [];
      let running = true;
      function sample() {
        if (!running) return;
        const angle = Number(
          wing.style.transform.match(/rotateY\(([^d]+)/)?.[1],
        );
        const scale = Number(
          sheet.style.transform.match(/scale3d\(([^,]+)/)?.[1],
        );
        if (angle > 38.01) frames.push({ angle, scale });
        requestAnimationFrame(sample);
      }
      sample();
      return {
        stop() {
          running = false;
          return frames;
        },
      };
    });
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    const frames = await recording.evaluate((recorder) => recorder.stop());
    await recording.dispose();
    await testInfo.attach('cold-opening-scale', {
      body: JSON.stringify(frames),
      contentType: 'application/json',
    });
    expect(frames.length).toBeGreaterThan(20);
    expect(frames[0].angle).toBeGreaterThan(140);
    expect(frames.at(-1)!.angle).toBeLessThan(40);
    const totalZoom = Math.log(frames[0].scale / frames.at(-1)!.scale);
    expect(totalZoom).toBeGreaterThanOrEqual(-0.001);
    const meanRate = totalZoom / (frames[0].angle - frames.at(-1)!.angle);
    for (let i = 1; i < frames.length; i += 1) {
      const before = frames[i - 1];
      const after = frames[i];
      const hingeTravel = before.angle - after.angle;
      if (hingeTravel < 0.1) continue;
      const zoom = Math.log(before.scale / after.scale);
      expect(
        zoom,
        'Unfolding must not reverse the camera pullback',
      ).toBeGreaterThanOrEqual(-0.00005);
      expect(
        zoom / hingeTravel,
        'No short part of the unfold should carry a sudden zoom surge',
      ).toBeLessThanOrEqual(meanRate * 2.2 + 0.00005);
    }
  });

  test(`the full three-panel opening unfolds before approaching the cover at ${viewport.width}×${viewport.height}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await expect(page.locator('.fold-panel')).toHaveCount(3);
    const folded = await wings(page);
    for (const wing of folded)
      expect(
        wing.angle,
        `${wing.name} starts as a substantially folded packet, not an already-open accordion`,
      ).toBeGreaterThanOrEqual(135);

    const chapters = page.locator('.chapter-nav button[data-go-to]');
    await chapters.nth(1).click();
    await waitForTourSettled(page);
    const firstReadingY = await page.evaluate(() => scrollY);
    expect(firstReadingY).toBeGreaterThan(200);
    const readingWings = await wings(page);
    const overviewY = await overviewPosition(page, firstReadingY, readingWings);
    await chapters.nth(0).click();
    await waitForTourSettled(page);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);

    const openingScale = await scale(page);
    const recording = await recordFrames(page);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 1);
    for (const fraction of [1 / 3, 2 / 3, 1]) {
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeGreaterThanOrEqual(Math.floor(overviewY * fraction));
      const path = testInfo.outputPath(`unfolding-${fraction.toFixed(2)}.png`);
      await page.screenshot({ path });
      await testInfo.attach(`unfolding-${fraction.toFixed(2)}`, {
        path,
        contentType: 'image/png',
      });
    }
    await waitForTourSettled(page);
    const opened = await wings(page);
    const overviewScale = await scale(page);
    for (const initial of folded) {
      const final = opened.find((wing) => wing.name === initial.name)!;
      expect(
        initial.angle - final.angle,
        `${initial.name} unfolds by at least 85 degrees while the whole flyer remains in view`,
      ).toBeGreaterThanOrEqual(85);
    }

    // One reverse gesture must complete the full return to the folded packet.
    await page.mouse.wheel(0, -1);
    await waitForTourSettled(page);
    const frames = await recording.evaluate((recorder) => recorder.stop());
    await recording.dispose();
    const evidence = testInfo.outputPath(
      'continuous-opening-and-reverse-bounds.json',
    );
    await writeFile(
      evidence,
      JSON.stringify(
        {
          viewport,
          firstReadingY,
          overviewY,
          folded,
          readingWings,
          opened,
          frames,
        },
        null,
        2,
      ),
    );
    await testInfo.attach('continuous-opening-and-reverse-bounds', {
      path: evidence,
      contentType: 'application/json',
    });
    expect(
      frames.length,
      'Both directions require continuous measured frames',
    ).toBeGreaterThan(35);
    expect(
      Math.max(...frames.map((frame) => frame.scroll)),
    ).toBeGreaterThanOrEqual(overviewY - 2);
    expect(
      frames.filter((frame) => frame.clipped.length),
      'Every panel must remain inside the actual header/control safe area throughout the full overview unfolding and reversal',
    ).toEqual([]);
    for (const initial of folded)
      await expect
        .poll(async () =>
          Math.abs(
            (await wings(page)).find((wing) => wing.name === initial.name)!
              .angle - initial.angle,
          ),
        )
        .toBeLessThan(1);
    await expect
      .poll(async () => Math.abs((await scale(page)) - openingScale))
      .toBeLessThan(0.02);

    // A close reading composition comes after the visible full-object reveal.
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThanOrEqual(overviewY - 2);
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(firstReadingY);
    expect(
      await scale(page),
      'The cover approach should visibly zoom in after the overview',
    ).toBeGreaterThan(overviewScale * 1.15);
  });
}
