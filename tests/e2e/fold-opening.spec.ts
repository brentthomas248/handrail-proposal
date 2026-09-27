import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// The overview is complete before the first readable cover position. Calibrate
// its native scroll distance through the chapter control, not private app state.
const overviewFraction = 1.7 / 2.65;

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
  test(`the full three-panel opening unfolds before approaching the cover at ${viewport.width}×${viewport.height}`, async ({
    page,
  }, testInfo) => {
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
    await page.waitForTimeout(1200);
    const firstReadingY = await page.evaluate(() => scrollY);
    expect(firstReadingY).toBeGreaterThan(200);
    await chapters.nth(0).click();
    await page.waitForTimeout(1200);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);

    const openingScale = await scale(page);
    const overviewY = firstReadingY * overviewFraction;
    const recording = await recordFrames(page);
    const screenshots = new Set([0, 8, 16, 24]);
    for (let step = 0; step <= 24; step += 1) {
      if (step > 0) {
        const current = await page.evaluate(() => scrollY);
        await page.mouse.wheel(
          0,
          Math.round((overviewY * step) / 24) - current,
        );
        await page.waitForTimeout(45);
      }
      if (screenshots.has(step)) {
        const path = testInfo.outputPath(`unfolding-${step}-of-24.png`);
        await page.screenshot({ path });
        await testInfo.attach(`unfolding-${step}-of-24`, {
          path,
          contentType: 'image/png',
        });
      }
    }
    await page.waitForTimeout(450);
    const opened = await wings(page);
    const overviewScale = await scale(page);
    for (const initial of folded) {
      const final = opened.find((wing) => wing.name === initial.name)!;
      expect(
        initial.angle - final.angle,
        `${initial.name} unfolds by at least 85 degrees while the whole flyer remains in view`,
      ).toBeGreaterThanOrEqual(85);
    }

    // Reverse the same natural input before approaching any reading crop.
    for (let step = 23; step >= 0; step -= 1) {
      const current = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, Math.round((overviewY * step) / 24) - current);
      await page.waitForTimeout(45);
    }
    await page.waitForTimeout(450);
    const frames = await recording.evaluate((recorder) => recorder.stop());
    await recording.dispose();
    const evidence = testInfo.outputPath(
      'continuous-opening-and-reverse-bounds.json',
    );
    await writeFile(
      evidence,
      JSON.stringify(
        { viewport, firstReadingY, overviewY, folded, opened, frames },
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
    await page.mouse.wheel(0, firstReadingY);
    await page.waitForTimeout(500);
    expect(
      await scale(page),
      'The cover approach should visibly zoom in after the overview',
    ).toBeGreaterThan(overviewScale * 1.15);
  });
}
