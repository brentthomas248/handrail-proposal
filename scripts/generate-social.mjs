import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const artwork = await readFile('public/social.svg', 'utf8');
  await page.setContent(
    `<style>body{margin:0}svg{display:block}</style>${artwork}`,
  );
  await page.screenshot({ path: 'public/social.png' });
} finally {
  await browser.close();
}
