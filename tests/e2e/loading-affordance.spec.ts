import { expect, test } from '@playwright/test';

test('a blocked tour module leaves an immediate link to the readable proposal', async ({
  page,
}, testInfo) => {
  let blocked = false;
  await page.route('**/_astro/*.js', (route) => {
    blocked = true;
    return route.abort('failed');
  });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).not.toHaveClass(/camera-ready/);
  const loading = page.locator('.tour-loading');
  await expect(loading.getByRole('status')).toHaveText('Opening the proposal');
  await expect(loading).toBeInViewport({ ratio: 1 });
  const read = loading.getByRole('link', {
    name: 'Read without animation',
    exact: true,
  });
  await expect(read).toHaveAttribute('href', /\?view=read$/);
  await testInfo.attach('blocked-module-reading-link', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  // The link must work while initialization is still pending, before recovery.
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await read.click();
  await expect(page).toHaveURL(/\?view=read$/);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('.proposal-sheet h1')).toBeVisible();
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(loading).toBeHidden();
  expect(blocked).toBe(true);
});

test('the mode control explains reduced motion and updates when the preference changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const mode = page.locator('#reading-mode');
  await expect(mode).toHaveText('Reduced motion');
  await expect(mode).toBeDisabled();
  await expect(mode).toHaveAttribute(
    'title',
    'Normal reading respects your reduced-motion preference.',
  );
  await expect(page.locator('.tour-loading')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(mode).toBeEnabled();
  await expect(mode).toHaveText('Read normally');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('.tour-loading')).toBeHidden();
  await mode.click();
  await expect(mode).toHaveText('Take the tour');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(mode).toHaveText('Reduced motion');
  await expect(mode).toBeDisabled();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(mode).toHaveText('Take the tour');
  await expect(mode).toBeEnabled();
});

test('the mode control explains reading enforced by text settings and clears when they are removed', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  // Apply the override to visible print; WebKit defers universal-rule style
  // invalidation inside the opening's display:none front faces until reveal.
  const beginning = page.getByRole('button', {
    name: 'The beginning',
    exact: true,
  });
  await beginning.press('Enter');
  await expect(beginning).toHaveAttribute('aria-current', 'step');
  const override = await page.addStyleTag({
    content: '* { letter-spacing: .12em !important; }',
  });
  const mode = page.locator('#reading-mode');
  await expect(mode).toHaveText('Reading view');
  await expect(mode).toBeDisabled();
  await expect(mode).toHaveAttribute(
    'title',
    'Normal reading preserves your text settings.',
  );
  await override.evaluate((element) =>
    element.parentNode?.removeChild(element),
  );
  await expect(mode).toHaveText('Take the tour');
  await expect(mode).toBeEnabled();
  await expect(mode).toHaveAttribute('title', '');
  await mode.click();
  await expect(mode).toHaveText('Read normally');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
});

test('reduced-motion explanation remains keyboard reachable without offering motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const mode = page.getByRole('button', {
    name: 'Reduced motion',
    exact: true,
  });
  await expect(mode).toHaveAccessibleDescription(
    'Normal reading respects your reduced-motion preference.',
  );
  await mode.focus();
  await expect(mode).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
});
