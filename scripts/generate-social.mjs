import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const logo = await readFile('public/handrail-logo.png');
  const font = await readFile(
    'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  );
  const artwork = (await readFile('public/social.svg', 'utf8')).replace(
    './handrail-logo.png',
    `data:image/png;base64,${logo.toString('base64')}`,
  );
  await page.setContent(
    `<style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font.toString('base64')});font-weight:100 900}body{margin:0}svg{display:block}</style>${artwork}`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social.png' });
} finally {
  await browser.close();
}
