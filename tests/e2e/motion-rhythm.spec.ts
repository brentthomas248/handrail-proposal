import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { waitForTourSettled } from '../helpers/tour-settled';

async function destination(page: Page, name: string): Promise<number> {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

async function sampleCameraPath(page: Page, start: number, end: number) {
  const samples: { scroll: number; yaw: number; scale: number }[] = [];
  // Holding input prevents the optional idle completion from changing each sample.
  await page.evaluate(() => window.dispatchEvent(new Event('touchstart')));
  try {
    const count = Math.ceil(Math.abs(end - start) / 50);
    for (let index = 0; index <= count; index += 1) {
      await page.evaluate(
        (top) => scrollTo({ top, behavior: 'instant' }),
        start + ((end - start) * index) / count,
      );
      await waitForTourSettled(page);
      samples.push(
        await page.locator('.proposal-sheet').evaluate((sheet) => {
          const matrix = new DOMMatrixReadOnly(
            getComputedStyle(sheet).transform,
          );
          return {
            scroll: scrollY,
            yaw: (Math.atan2(-matrix.m13, matrix.m33) * 180) / Math.PI,
            scale: Math.hypot(matrix.m11, matrix.m12, matrix.m13),
          };
        }),
      );
    }
  } finally {
    await page.evaluate(() => window.dispatchEvent(new Event('touchend')));
  }
  return samples;
}

function peakYawPer100Pixels(
  samples: Awaited<ReturnType<typeof sampleCameraPath>>,
) {
  return Math.max(
    ...samples
      .slice(1)
      .map(
        (sample, index) =>
          (Math.abs(sample.yaw - samples[index].yaw) * 100) /
          Math.abs(sample.scroll - samples[index].scroll),
      ),
  );
}

test('front headings retain opaque ink through opening and whole-tour rotation', async ({
  page,
}, testInfo) => {
  test.setTimeout(45_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const recording = await page.evaluateHandle(() => {
    const frames: {
      scroll: number;
      yaw: number;
      wing: number;
      headings: {
        text: string;
        color: string;
        alpha: number;
        opacity: number;
      }[];
    }[] = [];
    let running = true;
    const angle = (selector: string) => {
      const matrix = new DOMMatrixReadOnly(
        getComputedStyle(document.querySelector(selector)!).transform,
      );
      return (Math.atan2(-matrix.m13, matrix.m33) * 180) / Math.PI;
    };
    const sample = () => {
      if (!running) return;
      const headings = [
        ...document.querySelectorAll('.panel-face h1, .panel-face h2'),
      ]
        .filter(
          (heading) =>
            getComputedStyle(heading.closest('.panel-face')!).display !==
            'none',
        )
        .map((heading) => {
          const style = getComputedStyle(heading);
          const channels = style.color.match(/[\d.]+/g)!.map(Number);
          return {
            text: heading.textContent!.trim(),
            color: style.color,
            alpha: channels[3] ?? 1,
            opacity: Number(style.opacity),
          };
        });
      frames.push({
        scroll: scrollY,
        yaw: angle('.proposal-sheet'),
        wing: angle('[data-panel="left"]'),
        headings,
      });
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    return {
      stop: () => {
        running = false;
        return frames;
      },
    };
  });
  for (const chapter of [
    'The beginning',
    'Overview',
    'Grow together',
    'Overview',
  ]) {
    await destination(page, chapter);
  }
  const frames = await recording.evaluate((recorder) => recorder.stop());
  await recording.dispose();
  const artifact = testInfo.outputPath('front-heading-ink.json');
  await writeFile(artifact, JSON.stringify(frames));
  await testInfo.attach('front-heading-ink-through-rotation', {
    path: artifact,
    contentType: 'application/json',
  });
  const span = (values: number[]) => Math.max(...values) - Math.min(...values);
  expect(span(frames.map((frame) => frame.wing))).toBeGreaterThan(80);
  const headings = frames.flatMap((frame) => frame.headings);
  expect(headings.length).toBeGreaterThan(20);
  expect(
    Math.min(...headings.map((heading) => heading.alpha)),
    'Essential front headings must remain fully inked while the paper turns',
  ).toBe(1);
  expect(Math.min(...headings.map((heading) => heading.opacity))).toBe(1);
});

for (const width of [390, 1440]) {
  test(`single-crease turns keep consistent yaw per scroll distance at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const beginning = await destination(page, 'The beginning');
    const cash = await destination(page, 'Cash flow');
    const rates = await destination(
      page,
      width < 760 ? 'Hire first' : 'The two paths',
    );
    const peaks = [
      peakYawPer100Pixels(await sampleCameraPath(page, beginning, cash)),
      peakYawPer100Pixels(await sampleCameraPath(page, cash, rates)),
    ];
    await test.info().attach('single-crease-peaks', {
      body: JSON.stringify({
        peaks,
        ratio: Math.max(...peaks) / Math.min(...peaks),
      }),
      contentType: 'application/json',
    });
    expect(
      Math.min(...peaks),
      'Both transitions must include an actual crease turn',
    ).toBeGreaterThan(10);
    expect(
      Math.max(...peaks) / Math.min(...peaks),
      `Peak yaw per 100px must remain within 25% across single creases: ${peaks.join(', ')}`,
    ).toBeLessThanOrEqual(1.25);
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 390, height: 664 },
]) {
  test(`the phone cover approach limits scale change per scroll distance at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const cover = await destination(page, 'The beginning');
    const samples = await sampleCameraPath(page, 0, cover);
    const widest = samples.reduce(
      (lowest, sample, index) =>
        sample.scale < samples[lowest].scale ? index : lowest,
      0,
    );
    const approach = samples.slice(widest);
    expect(
      approach.length,
      'The full spread must precede a sampled approach',
    ).toBeGreaterThan(3);
    expect(approach.at(-1)!.scale / approach[0].scale).toBeGreaterThan(2);
    const peak = Math.max(
      ...approach
        .slice(1)
        .map(
          (sample, index) =>
            (Math.abs(Math.log(sample.scale / approach[index].scale)) * 100) /
            (sample.scroll - approach[index].scroll),
        ),
    );
    await test.info().attach('cover-approach-samples', {
      body: JSON.stringify({ viewport, peak, samples, widest }),
      contentType: 'application/json',
    });
    expect(
      peak,
      'The spread-to-cover approach must not compress its zoom into one small scroll gesture',
    ).toBeLessThanOrEqual(0.5);
  });
}

for (const width of [390, 1440]) {
  for (const direction of [-1, 1]) {
    test(`a 150px nudge holds and a 300px gesture completes the chapter at ${width}px going ${direction < 0 ? 'backward' : 'forward'}`, async ({
      page,
    }) => {
      test.setTimeout(45_000);
      await page.setViewportSize({ width, height: 844 });
      await page.goto('./');
      await expect(page.locator('html')).toHaveClass(/camera-ready/);
      const nextName =
        direction < 0
          ? 'The beginning'
          : width < 760
            ? 'Hire first'
            : 'The two paths';
      const next = await destination(page, nextName);
      const cash = await destination(page, 'Cash flow');
      await page.mouse.wheel(0, direction * 150);
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeCloseTo(cash + direction * 150, 0);
      // Observe the whole inactivity window, including delayed auto-travel, rather than only its final frame.
      const deviation = await page.evaluate(
        (expected) =>
          new Promise<number>((resolve) => {
            const started = performance.now();
            let maximum = 0;
            const observe = (now: number) => {
              maximum = Math.max(maximum, Math.abs(scrollY - expected));
              if (now - started >= 2500) resolve(maximum);
              else requestAnimationFrame(observe);
            };
            requestAnimationFrame(observe);
          }),
        cash + direction * 150,
      );
      expect
        .soft(
          deviation,
          'A small nudge must retain the reader’s native scroll position',
        )
        .toBeLessThanOrEqual(2);
      await destination(page, 'Cash flow');
      await page.mouse.wheel(0, direction * 300);
      await expect
        .poll(() => page.evaluate(() => scrollY), { timeout: 6000 })
        .toBeCloseTo(next, 0);
      await waitForTourSettled(page);
      expect(await page.evaluate(() => scrollY)).toBeCloseTo(next, 0);
    });
  }
}

async function angularTravel(page: Page, start: number, end: number) {
  return page.evaluate(
    async ({ start, end }) => {
      const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
      const yaw = () =>
        Number(
          sheet.style.transform.match(/rotateY\(([-\d.]+)deg\)/)?.[1] ?? 0,
        );
      window.dispatchEvent(new Event('touchstart'));
      scrollTo(0, start);
      await new Promise((resolve) => setTimeout(resolve, 450));
      let previous = yaw();
      let degrees = 0;
      let running = true;
      const record = () => {
        const current = yaw();
        degrees += Math.abs(current - previous);
        previous = current;
        if (running) requestAnimationFrame(record);
      };
      requestAnimationFrame(record);
      for (let step = 1; step <= 100; step += 1) {
        scrollTo(0, start + ((end - start) * step) / 100);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      await new Promise((resolve) => setTimeout(resolve, 450));
      running = false;
      window.dispatchEvent(new Event('touchend'));
      return {
        degrees,
        pixels: end - start,
        degreesPerPixel: degrees / (end - start),
      };
    },
    { start, end },
  );
}

for (const width of [390, 1440]) {
  test(`closing crosses two hinges without doubling rotation per scroll pixel at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const cash = await destination(page, 'Cash flow');
    const rate = await destination(
      page,
      width < 760 ? 'Hire first' : 'The two paths',
    );
    const window = await destination(page, 'The window');
    const closing = await destination(page, 'Grow together');
    const single = await angularTravel(page, cash, rate);
    const double = await angularTravel(page, window, closing);
    expect(single.degrees).toBeGreaterThan(80);
    expect(double.degrees).toBeGreaterThan(150);
    expect(double.degreesPerPixel).toBeLessThanOrEqual(
      single.degreesPerPixel * 1.05,
    );
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 390, height: 664 },
]) {
  test(`the cover headline stays framed as the camera approaches at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const end = await destination(page, 'The beginning');
    const clipped = await page.evaluate(async (end) => {
      const heading = document.querySelector<HTMLElement>('.flyer-cover h1')!;
      const misses: { scroll: number; left: number; right: number }[] = [];
      window.dispatchEvent(new Event('touchstart'));
      scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 450));
      for (let step = 0; step <= 100; step += 1) {
        scrollTo(0, (end * step) / 100);
        await new Promise((resolve) => setTimeout(resolve, 20));
        const box = heading.getBoundingClientRect();
        const effectiveFont =
          (parseFloat(getComputedStyle(heading).fontSize) * box.height) /
          heading.offsetHeight;
        if (!Number.isFinite(effectiveFont) || effectiveFont < 20) continue;
        for (const line of heading.children) {
          const range = document.createRange();
          range.selectNodeContents(line);
          const ink = range.getBoundingClientRect();
          if (ink.left < -1 || ink.right > innerWidth + 1)
            misses.push({ scroll: scrollY, left: ink.left, right: ink.right });
        }
      }
      window.dispatchEvent(new Event('touchend'));
      return misses;
    }, end);
    expect(clipped).toEqual([]);
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 320, height: 740 },
]) {
  test(`a canceled chapter shortcut restores the current chapter in the phone strip at ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const cash = await destination(page, 'Cash flow');
    await page
      .getByRole('button', { name: 'Grow together', exact: true })
      .click();
    await expect
      .poll(() => page.evaluate(() => scrollY), { intervals: [20] })
      .toBeGreaterThan(cash + 5);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    // A gesture has multiple samples: WebKit can use the first solely to
    // interrupt an in-flight programmatic scroll without native displacement.
    await page.mouse.wheel(0, -90);
    await page.waitForTimeout(50);
    const beforeSecondSample = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, -90);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeLessThan(beforeSecondSample - 5);
    const interrupted = await page.evaluate(() => scrollY);
    expect(interrupted).toBeLessThan(cash);
    // Include the idle completion window so a delayed restart cannot pass.
    await page.waitForTimeout(2500);
    await waitForTourSettled(page);
    const state = await page.locator('.chapter-nav').evaluate((nav) => {
      const button = nav.querySelector<HTMLButtonElement>('[aria-current]')!;
      const bounds = nav.getBoundingClientRect();
      const current = button.getBoundingClientRect();
      return {
        scroll: scrollY,
        label: button.getAttribute('aria-label'),
        nav: { left: bounds.left, right: bounds.right },
        current: { left: current.left, right: current.right },
      };
    });
    await testInfo.attach('canceled-shortcut-navigation', {
      body: JSON.stringify({ viewport, cash, interrupted, state }, null, 2),
      contentType: 'application/json',
    });
    expect(
      state.scroll,
      'The canceled camera jump must not restart',
    ).toBeCloseTo(interrupted, 0);
    expect(state.label).toBe('Cash flow');
    expect(
      state.current.left,
      'After vertical cancellation settles, the current chapter must be visible',
    ).toBeGreaterThanOrEqual(state.nav.left - 1);
    expect(state.current.right).toBeLessThanOrEqual(state.nav.right + 1);
  });
}
