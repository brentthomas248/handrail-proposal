import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { flyerCopy } from '../src/content/proposal.ts';
const statement = flyerCopy.cover.statement
  .match(/[^.!?]+[.!?]/g)
  ?.map((line) => line.trim());
if (statement?.length !== 2)
  throw new Error('Social cover expects two statement lines.');
let svg = await readFile('public/social.svg', 'utf8');
for (const [index, id] of ['first', 'second'].entries()) {
  const pattern = new RegExp(
    `(<text id="cover-statement-${id}"[^>]*>)[^<]*(</text>)`,
  );
  if (!pattern.test(svg))
    throw new Error(`Social cover is missing the ${id} statement line.`);
  const text = statement[index]
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  svg = svg.replace(pattern, (_, open, close) => `${open}${text}${close}`);
}
await writeFile('public/social.svg', svg);
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
  const artwork = svg.replace(
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
