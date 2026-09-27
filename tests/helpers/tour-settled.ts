import type { Page } from '@playwright/test';

/** Wait for a chapter landing, observing both native scroll and the camera. */
export async function waitForTourSettled(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        let previous = '';
        let stableSince = performance.now();
        let stableFrames = 0;
        let frame = 0;
        const timeout = setTimeout(() => {
          cancelAnimationFrame(frame);
          reject(
            new Error(`Tour did not settle within 8 seconds: ${previous}`),
          );
        }, 8000);
        const sample = (now: number) => {
          const root = document.documentElement;
          const sheet = document.querySelector('.proposal-sheet');
          const ready =
            root.dataset.presentation === 'tour' &&
            root.classList.contains('camera-ready') &&
            sheet;
          const state = JSON.stringify([
            scrollX,
            scrollY,
            innerWidth,
            innerHeight,
            ...[
              ...document.querySelectorAll('.proposal-sheet, .fold-panel'),
            ].map((element) => getComputedStyle(element).transform),
          ]);
          if (!ready || state !== previous) {
            previous = state;
            stableSince = now;
            stableFrames = 0;
          } else {
            stableFrames += 1;
            if (stableFrames >= 3 && now - stableSince >= 200) {
              clearTimeout(timeout);
              resolve();
              return;
            }
          }
          frame = requestAnimationFrame(sample);
        };
        frame = requestAnimationFrame(sample);
      }),
  );
}
